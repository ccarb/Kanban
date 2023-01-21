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
    fetch(CHECKLIST_API_URL+'item/1', {"method": "DELETE"}).catch(()=> console.log('revert deletion'));
    let items=[...checklistItems];
    items.splice(itemId,1);
    setChecklistItems(items);    
  };

  function handleCreate(){};

  function handleEdit(){};


    return (
      <div className="d-flex justify-content-center">
        <EditableListInCard 
          title={checklistInfo[0].name} 
          description={checklistInfo[0].description} 
          listElementType="item" 
          items={checklistItems.map(item => (item.name))}
          removeHandler={handleRemove}
          createHandler={handleCreate}
          editHandler={handleEdit}
        />
      </div>
    );
  }
  
export default DetailedChecklist;