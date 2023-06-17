import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import EditableListInCard from '../../components/editableListInCard';


import { CHECKLIST_API_URL } from '../../constants/apiUrls';

function DetailedChecklist(props) {
  const checklistId = useLoaderData();

  const [checklistInfo, setChecklistInfo] = useState([{'name':'Loading...','description':'',}]);
  const [checklistItems, setChecklistItems] = useState([{'name':'',}]);
  


  useEffect(()=>{
      function getChecklistItems(){
        return fetch(CHECKLIST_API_URL+checklistId+'/items/').then(response => response.json()).then(data => setChecklistItems([...data.checklistItems]));
      };
      function getChecklistInfo(){
        return fetch(CHECKLIST_API_URL+checklistId).then(response => response.json()).then(data => setChecklistInfo(data));
      };
      getChecklistInfo();
      getChecklistItems();
  },[checklistId]);

  function handleRemove(itemId){
    let items = [...checklistItems];
    let removedItem = items.filter(item => item.pk === itemId);
    items = items.filter(item => item.pk !== itemId);
    setChecklistItems(items);
    fetch(CHECKLIST_API_URL+'item/'+itemId, {"method": "DELETE"}).catch(() => revertDelete());
    function revertDelete(){
      if (items.indexOf(removedItem) < 0){
        items.concat(removedItem);
        setChecklistItems(items)
      }
    }
  };


  function handleCreate(name){
    let items=[...checklistItems];
    let order=checklistItems.length;
    items=items.concat({'name': name, 'order': order, 'pk':'-1', 'done': false})
    setChecklistItems(items);
    fetch(CHECKLIST_API_URL+checklistId+'/items/', {
      method: "POST", 
      headers: new Headers({'content-type': 'application/json'}),
      body: '{"checklistId": ' + checklistId + ', "name": "'+ name +'","order": "' + order + '", "done": false}',
    }).catch(() => revertCreate());
    function revertCreate(){
      if (order !== items.length){
        items.splice(items.length-1,1); 
        setChecklistItems(items)
      }
    };
  };

  function handleEdit(editedItem){
    let items=[...checklistItems];
    let itemToEdit = items.filter(item => item.pk === editedItem.pk);
    let indexToEdit=items.findIndex(item => item.pk === editedItem.pk);
    items[indexToEdit].name=editedItem.name;
    setChecklistItems(items);
    fetch(CHECKLIST_API_URL+'item/'+editedItem.pk, {
      method: "PUT", 
      headers: new Headers({'content-type': 'application/json'}),
      body: '{"checklistId": ' + editedItem.checklistId + ', "name": "'+ editedItem.name +'","order": "' + editedItem.order + '", "done": false}',
    }).catch(() => revertUpdate());
    function revertUpdate(){
      items[indexToEdit]=itemToEdit[0];
      setChecklistItems([...items]);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <EditableListInCard 
        title={checklistInfo[0].name} 
        description={checklistInfo[0].description} 
        listElementType="item" 
        items={checklistItems}
        removeHandler={handleRemove}
        createHandler={handleCreate}
        editHandler={handleEdit}
      />
    </div>
  );
}
  
export default DetailedChecklist;