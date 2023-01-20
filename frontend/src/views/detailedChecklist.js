import React, { createRef, useEffect, useState } from 'react';
import EditableListInCard from '../components/editableListInCard';
//import RemoveModal from '../components/removeModal';

import { CHECKLIST_API_URL } from '..';

function DetailedChecklist() {
    const [checklistInfo, setChecklistInfo] = useState([{'name':'','description':'',}]);
    const [checklistItems, setChecklistItems] = useState([{'name':'',}]);

    function getChecklistInfo(){
        return fetch(CHECKLIST_API_URL+'1').then(response => response.json()).then(data => setChecklistInfo(data));
    }

    function getChecklistItems(){
        return fetch(CHECKLIST_API_URL+'1/items/').then(response => response.json()).then(data => setChecklistItems([...data.checklistItems]));
    }

    useEffect(()=>{
        getChecklistInfo();
        getChecklistItems();
    },[]);

    return (
      <div className="d-flex justify-content-center">
        <EditableListInCard title={checklistInfo[0].name} description={checklistInfo[0].description} items={checklistItems.map(item => (item.name))}/>
      </div>
    );
  }
  
export default DetailedChecklist;