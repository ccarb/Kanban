import React, { useEffect, useState } from 'react';
import EditableListInCard from '../components/editableListInCard';


import { CHECKLIST_API_URL } from '..';

function useCheklistData(checklistId){
    const [checklistInfo, setChecklistInfo] = useState([{'name':'','description':'',}]);
    const [checklistItems, setChecklistItems] = useState([{'name':'',}]);

    function getChecklistInfo(){
        return fetch(CHECKLIST_API_URL+checklistId).then(response => response.json()).then(data => setChecklistInfo(data));
    }

    function getChecklistItems(){
        return fetch(CHECKLIST_API_URL+checklistId+'/items/').then(response => response.json()).then(data => setChecklistItems([...data.checklistItems]));
    }

    useEffect(()=>{
        getChecklistInfo();
        getChecklistItems();
    },[]);

  return [checklistInfo, checklistItems];
}

function DetailedChecklist() {

    const [checklistInfo, checklistItems] = useCheklistData('1');

    return (
      <div className="d-flex justify-content-center">
        <EditableListInCard title={checklistInfo[0].name} description={checklistInfo[0].description} listElementType="item" items={checklistItems.map(item => (item.name))} removeURL={CHECKLIST_API_URL+'item/'} />
      </div>
    );
  }
  
export default DetailedChecklist;