import json
from django.test import TestCase, RequestFactory
from knox.auth import AuthToken

from ..models import Board, Column
from ..views import columns, column, columnBulkUpdate
from .fixture import DatabaseElements

class ColumnsViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def test_anonymus_get_non_existant(self):
        request = self.factory.get('boards/3/columns', content_type='application/json')
        response = columns(request,3)
        self.assertEqual(response.status_code,200)
        response.render()
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertEqual(len(responseData['columns']),0)
    
    def test_anonymus_get_not_public(self):
        request = self.factory.get('boards/2/columns', content_type='application/json')
        response = columns(request,2)
        self.assertEqual(response.status_code,403)

    def test_anonymus_get_succsessful(self):
        request = self.factory.get('boards/1/columns', content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,200)
        response.render()
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertEqual(len(responseData['columns']),5)
        self.assertListEqual(self.dbElements.columnsDict[0:5],responseData['columns'])
        
    def test_authenticated_get_owned_successful(self):
        request = self.factory.get('boards/2/columns', content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = columns(request,2)
        self.assertEqual(response.status_code,200)

    def test_authenticated_get_public_successful(self):
        request = self.factory.get('boards/1/columns', content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = columns(request,1)
        self.assertEqual(response.status_code,200)

    def test_anonymus_post_backlog_column(self):
        data = {'name': 'new column', 'order': 4, 'board': 1}
        data['colType']=Column.ColType.BACKLOG.title()
        request = self.factory.post('boards/1/columns', data=data, content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,403)

    def test_anonymus_post_archive_column(self):
        data = {'name': 'new column', 'order': 4, 'board': 1}
        data['colType']=Column.ColType.ARCHIVE.title()
        request = self.factory.post('boards/1/columns', data=data, content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,403)

    def test_anonymus_post_invalid_order_oob(self):
        data = {'name': 'new column', 'board': 1}
        data['colType']=Column.ColType.NORMAL.title()
        data['order']=100
        request = self.factory.post('boards/1/columns', data=data,content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,400)

    def test_anonymus_post_invalid_order_reserved(self):
        data = {'name': 'new column', 'board': 1}
        data['colType']=Column.ColType.NORMAL.title()
        data['order']=11
        request = self.factory.post('boards/1/columns', data=data,content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,403)

    def test_anonymus_post_invalid_data(self):
        request = self.factory.post('boards/1/columns', data={'keyNotInColumn':'randomString'},content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,400)

    def test_anonymus_post_invalid_board(self):
        request = self.factory.post('boards/3/columns', data={'keyNotInColumn':'randomString'},content_type='application/json')
        response = columns(request,3)
        self.assertEqual(response.status_code,400)

    def test_anonymus_post_public_successful(self):
        data = {'name': 'new column', 'order': 4, 'board': 1}
        data['colType']=Column.ColType.NORMAL.title()
        request = self.factory.post('boards/1/columns', data=data, content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,201)
    
    def test_anonymus_post_limit_reached(self):
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

    def test_anonymus_post_not_public(self):
        data = {'name': 'new column', 'order': 4, 'board': 1}
        data['colType']=Column.ColType.NORMAL.title()
        request = self.factory.post('boards/2/columns', data=data, content_type='application/json')
        response = columns(request,2)
        self.assertEqual(response.status_code,403)
        
    def test_authenticated_post_owned_successful(self):
        data = {'name': 'new column', 'order': 4, 'board': 1}
        data['colType']=Column.ColType.NORMAL.title()
        request = self.factory.post('boards/2/columns', data=data, content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = columns(request,2)
        self.assertEqual(response.status_code,201)

    def test_authenticated_post_public_successful(self):
        data = {'name': 'new column', 'order': 4, 'board': 1}
        data['colType']=Column.ColType.NORMAL.title()
        request = self.factory.post('boards/1/columns', data=data, content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = columns(request,1)
        self.assertEqual(response.status_code,201)




class ColumnViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def test_anonymus_put_invalid_data(self):
        request = self.factory.put('boards/columns/1/', data = {'keyNotInColumn': 'Updated Name'}, content_type='application/json')
        response = column(request,1)
        self.assertEqual(response.status_code,400)

    def test_anonymus_put_not_exists(self):
        request = self.factory.put('boards/columns/100/', data = {'name': 'Updated Name', 'order': 1, 'board':1}, content_type='application/json')
        response = column(request,100)
        self.assertEqual(response.status_code,404)

    def test_anonymus_put_invalid_col_type_changed(self):
        request = self.factory.put('board/columns/2/', data = {'name': 'Updated Name', 'order': 2, 'board':1, 'colType':Column.ColType.BACKLOG.title()}, content_type='application/json')
        response = column(request,2)
        self.assertEqual(response.status_code,403)

    def test_anonymus_put_invalid_col_type_B_A_order_changed(self):
        request = self.factory.put('board/columns/1/', data = {'name': 'Another Name', 'order': 2, 'board':1}, content_type='application/json')
        response = column(request,1)
        self.assertEqual(response.status_code,403)

    def test_anonymus_put_change_B_name_successful(self):
        request = self.factory.put('board/columns/1/', data = {'name': 'Updated Name', 'order': 0, 'board':1, 'colType':Column.ColType.BACKLOG.title()}, content_type='application/json')
        response = column(request,1)
        self.assertEqual(response.status_code,204)
        modelColumns=Column.objects.filter(board=1)
        self.assertEqual(len(modelColumns),5)
        self.assertEqual(modelColumns[0].name,"Updated Name")

    def test_anonymus_put_change_A_name_successful(self):
        request = self.factory.put('board/columns/1/', data = {'name': 'Another Name', 'order': 0, 'board':1}, content_type='application/json')
        response = column(request,1)
        self.assertEqual(response.status_code,204)
        modelColumns=Column.objects.filter(board=1)
        self.assertEqual(len(modelColumns),5)
        self.assertEqual(modelColumns[0].name,"Another Name")
        self.assertEqual(modelColumns[0].colType, Column.ColType.BACKLOG)
    
    def test_anonymus_put_public_successful(self):
        request = self.factory.put('board/columns/2/', data = {'name': 'Updated Name', 'order': 2, 'board':1}, content_type='application/json')
        response = column(request,2)
        self.assertEqual(response.status_code,204)
        modelColumns=Column.objects.filter(board=1)
        self.assertEqual(len(modelColumns),5)
        self.assertEqual(modelColumns[1].name,"Updated Name")

    def test_anonymus_put_not_public(self):
        request = self.factory.put('board/columns/7/', data = {'name': 'Updated Name', 'order': 2, 'board':1}, content_type='application/json')
        response = column(request,7)
        self.assertEqual(response.status_code,403)

    def test_authenticated_put_owned_successful(self):
        request = self.factory.put('board/columns/7/', data = {'name': 'Updated Name', 'order': 2, 'board':2}, content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = column(request,7)
        self.assertEqual(response.status_code,204)
        modelColumns=Column.objects.filter(board=2)
        self.assertEqual(len(modelColumns),5)
        self.assertEqual(modelColumns[1].name,"Updated Name")

    def test_authenticated_put_public_successful(self):
        data = {'name': 'new column', 'order': 4, 'board': 1}
        data['colType']=Column.ColType.NORMAL.title()
        request = self.factory.post('boards/2/columns', data=data, content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = columns(request,2)
        self.assertEqual(response.status_code,201)

    def test_anonymus_delete_successful(self):
        request = self.factory.delete('boards/columns/2', content_type='application/json')
        response = column(request,2)
        self.assertEqual(response.status_code,204)
        self.assertRaises(Column.DoesNotExist, lambda: Column.objects.get(id=2))

    def test_anonymus_delete_backlog(self):
        request = self.factory.delete('boards/columns/1', content_type='application/json')
        response = column(request,1)
        self.assertEqual(response.status_code,403)

    def test_anonymus_delete_not_exists(self):
        request = self.factory.delete('boards/columns/100', content_type='application/json')
        response = column(request,100)
        self.assertEqual(response.status_code,404)

    def test_anonymus_delete_not_public(self):
        request = self.factory.delete('boards/columns/7', content_type='application/json')
        response = column(request,7)
        self.assertEqual(response.status_code,403)

    def test_authenticated_delete_owned_successful(self):
        request = self.factory.delete('boards/columns/7', content_type='application/json')
        token = AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = column(request,7)
        self.assertEqual(response.status_code,204)
        self.assertRaises(Column.DoesNotExist, lambda: Column.objects.get(id=7))

    def test_authenticated_delete_public_successful(self):
        request = self.factory.delete('boards/columns/2', content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = column(request,2)
        self.assertEqual(response.status_code,204)
        self.assertRaises(Column.DoesNotExist, lambda: Column.objects.get(id=2))

class ColumnBulkUpdateTest(TestCase):
    def setUp(self):
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def test_anonymus_put_invalid_column_data(self):
        request = self.factory.put('boards/columns/reorder/', data = [{'id':2, 'keyNotInColumn': 'Updated Name'}], content_type='application/json')
        response = columnBulkUpdate(request)
        self.assertEqual(response.status_code,400)

    def test_anonymus_put_invalid_column_ids(self):
        request = self.factory.put('boards/columns/reorder/', data = [{'id':120}], content_type='application/json')
        response = columnBulkUpdate(request)
        self.assertEqual(response.status_code,400)

    def test_anonymus_put_invalid_input_col_type(self):
        data = self.dbElements.columnsDict[0:2]
        swap = data[0]['order']
        data[0]['order']=data[1]['order']
        data[1]['order']=swap
        request = self.factory.put('boards/columns/reorder/', data = data, content_type='application/json')
        response = columnBulkUpdate(request)
        self.assertEqual(response.status_code,403)

    def test_anonymus_put_invalid_output_col_type(self):
        data = self.dbElements.columnsDict[1:3]
        swap = data[0]['order']
        data[0]['order']=data[1]['order']
        data[1]['order']=swap
        data[1]['colType']='A'
        request = self.factory.put('boards/columns/reorder/', data = data, content_type='application/json')
        response = columnBulkUpdate(request)
        self.assertEqual(response.status_code,403)

    def test_anonymus_put_successful(self):
        data = self.dbElements.columnsDict[1:3]
        swap = data[0]['order']
        data[0]['order']=data[1]['order']
        data[1]['order']=swap
        request = self.factory.put('boards/columns/reorder/', data = data, content_type='application/json')
        response = columnBulkUpdate(request)
        self.assertEqual(response.status_code,204)
        self.assertEqual(Column.objects.get(id=data[0]['id']).order, data[0]['order'])
        self.assertEqual(Column.objects.get(id=data[1]['id']).order, data[1]['order'])

    def test_anonymus_put_not_public(self):
        data = self.dbElements.columnsDict[6:8]
        swap = data[0]['order']
        data[0]['order']=data[1]['order']
        data[1]['order']=swap
        request = self.factory.put('boards/columns/reorder/', data = data, content_type='application/json')
        response = columnBulkUpdate(request)
        self.assertEqual(response.status_code,403)

    def test_authenticated_put_public_successful(self):
        data = self.dbElements.columnsDict[1:3]
        swap = data[0]['order']
        data[0]['order']=data[1]['order']
        data[1]['order']=swap
        request = self.factory.put('boards/columns/reorder/', data = data, content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = columnBulkUpdate(request)
        self.assertEqual(response.status_code,204)
        self.assertEqual(Column.objects.get(id=data[0]['id']).order, data[0]['order'])
        self.assertEqual(Column.objects.get(id=data[1]['id']).order, data[1]['order'])

    def test_authenticated_put_owned_successful(self):
        data = self.dbElements.columnsDict[6:8]
        swap = data[0]['order']
        data[0]['order']=data[1]['order']
        data[1]['order']=swap
        request = self.factory.put('boards/columns/reorder/', data = data, content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = columnBulkUpdate(request)
        self.assertEqual(response.status_code,204)
        self.assertEqual(Column.objects.get(id=data[0]['id']).order, data[0]['order'])
        self.assertEqual(Column.objects.get(id=data[1]['id']).order, data[1]['order'])
