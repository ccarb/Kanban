import json
from django.test import TestCase, RequestFactory

from ..models import Board, Column
from ..views import columns, column, columnBulkUpdate
from .fixture import DatabaseElements

class ColumnsViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def testGet(self):
        request = self.factory.get('boards/1/columns', content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,200)
        response.render()
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertEqual(len(responseData['columns']),5)
        self.assertListEqual(self.dbElements.columnsDict[0:5],responseData['columns'])

    def testPost(self):
        #cannot create backlog columns
        data = {'name': 'new column', 'order': 4, 'board': 1}
        data['colType']=Column.ColType.BACKLOG.title()
        request = self.factory.post('boards/1/columns', data=data, content_type='application/json')
        #cannot create archive columns
        response = columns(request,1)
        self.assertEqual(response.status_code,403)
        data['colType']=Column.ColType.ARCHIVE.title()
        request = self.factory.post('boards/1/columns', data=data, content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,403)
        # higher than allowed order value
        data['colType']=Column.ColType.NORMAL.title()
        data['order']=100
        request = self.factory.post('boards/1/columns', data=data,content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,400)
        # reserved order value
        data['order']=11
        request = self.factory.post('boards/1/columns', data=data,content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,403)
        #invalid data
        request = self.factory.post('boards/1/columns', data={'keyNotInColumn':'randomString'},content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,400)
        #non existant board
        request = self.factory.post('boards/3/columns', data={'keyNotInColumn':'randomString'},content_type='application/json')
        response = columns(request,3)
        self.assertEqual(response.status_code,400)
        # happy creations
        data=[{'name': 'new column', 'order': i, 'board': 1} for i in range(4,11)]
        for dataId, dataElement in enumerate(data):
            request = self.factory.post('boards/1/columns', data=dataElement, content_type='application/json')
            response = columns(request,1)
            self.assertEqual(response.status_code,201)
            response.render()
            responseText=response.content.decode('utf-8')
            responseData=json.loads(responseText)
            self.assertDictContainsSubset(dataElement,responseData)
            allColumns=Column.objects.filter(board=1)
            self.assertEqual(len(allColumns),6 + dataId)
            self.assertTrue(Column.objects.get(pk=responseData['id']))
        # column limit reached
        request = self.factory.post('boards/1/columns', data=data[0],content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,403)
        

class ColumnViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def testPut(self):
        # invalid data
        request = self.factory.put('boards/columns/1/', data = {'keyNotInColumn': 'Updated Name'}, content_type='application/json')
        response = column(request,1)
        self.assertEqual(response.status_code,400)
        # invalid id
        request = self.factory.put('boards/columns/100/', data = {'name': 'Updated Name', 'order': 1, 'board':1}, content_type='application/json')
        response = column(request,100)
        self.assertEqual(response.status_code,404)
        # invalid col type, cannot change coltype
        request = self.factory.put('board/columns/2/', data = {'name': 'Updated Name', 'order': 2, 'board':1, 'colType':Column.ColType.BACKLOG.title()}, content_type='application/json')
        response = column(request,2)
        self.assertEqual(response.status_code,403)
        # invalid data, cannot change archive or backlog order
        request = self.factory.put('board/columns/1/', data = {'name': 'Another Name', 'order': 2, 'board':1}, content_type='application/json')
        response = column(request,1)
        self.assertEqual(response.status_code,403)
        # happy path on backlog col
        request = self.factory.put('board/columns/1/', data = {'name': 'Updated Name', 'order': 0, 'board':1, 'colType':Column.ColType.BACKLOG.title()}, content_type='application/json')
        response = column(request,1)
        self.assertEqual(response.status_code,204)
        modelColumns=Column.objects.filter(board=1)
        self.assertEqual(len(modelColumns),5)
        self.assertEqual(modelColumns[0].name,"Updated Name")
        # happy path on backlog col no coltype
        request = self.factory.put('board/columns/1/', data = {'name': 'Another Name', 'order': 0, 'board':1}, content_type='application/json')
        response = column(request,1)
        self.assertEqual(response.status_code,204)
        modelColumns=Column.objects.filter(board=1)
        self.assertEqual(len(modelColumns),5)
        self.assertEqual(modelColumns[0].name,"Another Name")
        self.assertEqual(modelColumns[0].colType, Column.ColType.BACKLOG)
        # happy path no col type on normal col
        request = self.factory.put('board/columns/2/', data = {'name': 'Updated Name', 'order': 2, 'board':1}, content_type='application/json')
        response = column(request,2)
        self.assertEqual(response.status_code,204)
        modelColumns=Column.objects.filter(board=1)
        self.assertEqual(len(modelColumns),5)
        self.assertEqual(modelColumns[1].name,"Updated Name")

    def testDelete(self):
        request = self.factory.delete('boards/columns/2', content_type='application/json')
        response = column(request,2)
        self.assertEqual(response.status_code,204)
        self.assertRaises(Column.DoesNotExist, lambda: Column.objects.get(id=2))
        request = self.factory.delete('boards/columns/1', content_type='application/json')
        response = column(request,1)
        self.assertEqual(response.status_code,403)
        request = self.factory.delete('boards/columns/2', content_type='application/json')
        response = column(request,2)
        self.assertEqual(response.status_code,404)

class ColumnBulkUpdateTest(TestCase):
    def setUp(self):
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def testPutInvalidColumnData(self):
        request = self.factory.put('boards/columns/reorder/', data = [{'id':2, 'keyNotInColumn': 'Updated Name'}], content_type='application/json')
        response = columnBulkUpdate(request)
        self.assertEqual(response.status_code,400)

    def testPutInvalidColumnIds(self):
        request = self.factory.put('boards/columns/reorder/', data = [{'id':120}], content_type='application/json')
        response = columnBulkUpdate(request)
        self.assertEqual(response.status_code,400)

    def testPutInvalidInputColType(self):
        data = self.dbElements.columnsDict[0:2]
        swap = data[0]['order']
        data[0]['order']=data[1]['order']
        data[1]['order']=swap
        request = self.factory.put('boards/columns/reorder/', data = data, content_type='application/json')
        response = columnBulkUpdate(request)
        self.assertEqual(response.status_code,403)

    def testPutInvalidOutputColType(self):
        data = self.dbElements.columnsDict[1:3]
        swap = data[0]['order']
        data[0]['order']=data[1]['order']
        data[1]['order']=swap
        data[1]['colType']='A'
        request = self.factory.put('boards/columns/reorder/', data = data, content_type='application/json')
        response = columnBulkUpdate(request)
        self.assertEqual(response.status_code,403)

    def testPutOK(self):
        data = self.dbElements.columnsDict[1:3]
        swap = data[0]['order']
        data[0]['order']=data[1]['order']
        data[1]['order']=swap
        request = self.factory.put('boards/columns/reorder/', data = data, content_type='application/json')
        response = columnBulkUpdate(request)
        self.assertEqual(response.status_code,204)
        self.assertEqual(Column.objects.get(id=data[0]['id']).order, data[0]['order'])
        self.assertEqual(Column.objects.get(id=data[1]['id']).order, data[1]['order'])
