import React, { useEffect, useState } from 'react';
import EditableListInCard from '../components/editableListInCard';


import { CHECKLIST_API_URL } from '..';

function DetailedChecklist() {

  const [checklistInfo, setChecklistInfo] = useState([{'name':'Loading...','description':'',}]);
  const [checklistItems, setChecklistItems] = useState([{'name':'',}]);

  function getChecklistInfo(checklistId){
      return fetch(CHECKLIST_API_URL+checklistId).then(response => response.json()).then(data => setChecklistInfo(data));
  };

  function getChecklistItems(checklistId){
      return fetch(CHECKLIST_API_URL+checklistId+'/items/').then(response => response.json()).then(data => setChecklistItems([...data.checklistItems]));
  };

  useEffect(()=>{
      getChecklistInfo(1);
      getChecklistItems(1);
  },[]);

  function handleRemove(itemId){
    let items=[...checklistItems];
    let removedItem =items.filter(item => item.pk === itemId);
    items=items.filter(item => item.pk !== itemId);
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
    fetch(CHECKLIST_API_URL+'1/items/', {
      method: "POST", 
      headers: new Headers({'content-type': 'application/json'}),
      body: '{"checklistId": 1, "name": "'+ name +'","order": "' + order + '", "done": false}',
    }).catch(() => revertCreate());
    function revertCreate(){
      console.log('i run')
      if (order !== items.length){
        items.splice(items.length-1,1); 
        setChecklistItems(items)
        console.log('Revert creation did fine')
      }
    };
  };


  function handleEdit(){};


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