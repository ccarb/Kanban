import { useEffect, useState } from 'react';
import {useLoaderData} from 'react-router';
import {Link} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { KANBAN_API_URL } from '../../constants/apiUrls';
import { BOARD_API_URL } from '../../constants/apiUrls';
import KanbanCard from './kanbanCard';
import ErrorModal from '../../components/errorModal';
import errorMessages from '../../constants/errorMessages';
import FormModal from '../../components/formModal';
import KanbanCardForm from './kanbanCardForm';

function Kanban(props){
    const boardId = useLoaderData();

    const [kanbanData, setKanbanData] = useState({});

    useEffect(()=>{
        function getKanbanData(){
            return fetch(KANBAN_API_URL+boardId).then(response => { if (response.ok) {return response.json()} else {throw new Error(errorMessages.BACKEND_NOT_OK)}}).then(data => setKanbanData(data)).catch((error) => {console.error(error);document.dispatchEvent(new CustomEvent("error", {detail: error}))});
        };
        getKanbanData();
    },[boardId]);

    function handleRemove(cardId){
        let kDataCopy = {...kanbanData};
        let allCards = [];
        kDataCopy.columns.forEach(column => {
            allCards=allCards.concat(column.cards);
        });
        let removedCard = allCards.filter(card => card.id === cardId);
        let columnArrPos = kDataCopy.columns.findIndex(column => column.id === removedCard[0].column);
        let cards = kDataCopy.columns[columnArrPos].cards.filter(card => card.id !== cardId);
        kDataCopy.columns[columnArrPos].cards=cards;
        setKanbanData(kDataCopy);
        fetch(BOARD_API_URL+'columns/cards/'+cardId, {"method": "DELETE"})
        .then(response => { if (response.ok) {return response.json()} else {throw new Error(errorMessages.BACKEND_NOT_OK)}})
        .catch(revertDelete);
        function revertDelete(){
          if (cards.indexOf(removedCard) > -1){
            cards=cards.concat(removedCard);
            kDataCopy.columns[columnArrPos].cards=cards;
            setKanbanData(kDataCopy);
          }
        }
    };

    function handleCreate(form, additionalInfo){
        let newCard={};
        form.Card.forEach((input) => newCard[input.name] = input.value);
        newCard = {...newCard, ...additionalInfo};
        let kDataCopy = {...kanbanData};
        let columnArrPos = kDataCopy.columns.findIndex(column => column.id === newCard.column);
        fetch(BOARD_API_URL+'columns/'+newCard.column+'/cards', {
            method: "POST", 
            headers: new Headers({'content-type': 'application/json'}), 
            body: JSON.stringify(newCard)
        })
        .then(response => { if (response.ok) {return response.json()} else {throw new Error(errorMessages.BACKEND_NOT_OK)}})
        .then((data) => {
            kDataCopy.columns[columnArrPos].cards.pop();
            kDataCopy.columns[columnArrPos].cards=kDataCopy.columns[columnArrPos].cards.concat(data);
            setKanbanData({...kDataCopy});
        })
        .catch(revertCreate);
        newCard.id=-1;
        kDataCopy.columns[columnArrPos].cards=kDataCopy.columns[columnArrPos].cards.concat(newCard);
        setKanbanData({...kDataCopy});
        function revertCreate(){
            kDataCopy.columns[columnArrPos].cards.pop();
            setKanbanData({...kDataCopy});
        }
    };

    function handleEdit(form, additionalInfo){
        let kDataCopy = {...kanbanData};
        let allCards = [];
        kDataCopy.columns.forEach(column => {
            allCards=allCards.concat(column.cards);
        });
        let oldCard = allCards.filter(card => card.id === additionalInfo.id);
        let editedCard = {...oldCard[0]};
        form.EditedCard.forEach((input) => editedCard[input.name] = input.value);
        let columnArrPos=kDataCopy.columns.findIndex(column => column.id === editedCard.column);
        let cardArrPos=kDataCopy.columns[columnArrPos].cards.findIndex(card => card.id === editedCard.id);
        kDataCopy.columns[columnArrPos].cards[cardArrPos]=editedCard;
        setKanbanData({...kDataCopy});
        fetch(BOARD_API_URL+'columns/cards/'+additionalInfo.id, {
            method: "PUT", 
            headers: new Headers({'content-type': 'application/json'}), 
            body: JSON.stringify(editedCard)
        })
        .then(response => { if (response.ok) {return 0} else {throw new Error(errorMessages.BACKEND_NOT_OK)}})
        .catch(revertEdit);
        function revertEdit(){
            kDataCopy.columns[columnArrPos].cards[cardArrPos]=oldCard[0];
            setKanbanData({...kDataCopy});
        }
    }
    
    function handleDrag(dragActionResult){
        const { destination, source, draggableId } = dragActionResult;

        if (!destination) {
            return;
        }
      
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        let sourceColumn = kanbanData.columns.find(column => column.id === parseInt(source.droppableId, 10));
        let editedCard = sourceColumn.cards.find(card => card.id === parseInt(draggableId,10));
        editedCard.column = destination.droppableId;
        let backendPayload;
        // Reorder in same column
        if (destination.droppableId === source.droppableId){
            sourceColumn.cards.splice(source.index, 1);
            sourceColumn.cards.splice(destination.index, 0, editedCard);
            sourceColumn.cards.forEach((card, index) => card.order = index);
            let kDataCopy = {...kanbanData};
            setKanbanData({...kDataCopy});
            backendPayload = sourceColumn.cards;
        }
        // Move column then reorder
        else {
            sourceColumn.cards.splice(source.index, 1);
            sourceColumn.cards.forEach((card, index) => card.order = index);
            let destinationColumn = kanbanData.columns.find(column => column.id === parseInt(destination.droppableId, 10));
            destinationColumn.cards.splice(destination.index, 0, editedCard);
            destinationColumn.cards.forEach((card, index) => card.order = index);
            backendPayload = [...sourceColumn.cards, ...destinationColumn.cards];
        }
        
        //persist changes

        fetch(`${BOARD_API_URL}columns/cards/reorder`, {
            method: "PUT", 
            headers: new Headers({'content-type': 'application/json'}), 
            body: JSON.stringify(backendPayload)
        })
        .then(response => { if (response.ok) {return 0} else {throw new Error(errorMessages.BACKEND_NOT_OK)}})
        .catch(revertDrag)
        // revert if backend not respond
        function revertDrag(){
            
        }
    }

    function Columns(props){
        let cols;
        if (kanbanData.columns){
            cols=(kanbanData.columns.sort((a, b) => {
                if (a.order === b.order){
                    return 0;
                }
                else if (a.order > b.order){
                    return 1;
                } else if (a.order < b.order){
                    return -1;
                } else {
                    console.error(`Wrong data: a: ${a.order}, b: ${b.order}`);
                    return 0;
                }
              }).map(column => (
                <Col key={column.id}>
                  <h3 className='fw-bold mb-3'>{column.name}</h3>
                  <Droppable droppableId={column.id.toString()}>
                    {provided => (
                        <>
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            <Cards cards={column.cards} column={column.id}/>
                        </div>
                        {provided.placeholder}
                        
                        </>
                    )}
                  </Droppable>
                  <FormModal additionalInfo={{'column': column, 'order': column.cards.length+1}} form={<KanbanCardForm/>} createdEntity="Card" formHandler={handleCreate}><p className='text-secondary'>Create new card...</p></FormModal>
                </Col>
                )))
              ;
        }
        else{
            cols=(
            <Col>
              <h3 className='fw-bold mb-3'>Loading...</h3>
            </Col>
            );
        }
        return cols;
    }

    function Cards(props){
        let cards;
        if (props.cards){
            cards=<>
                    {props.cards.sort((a, b) => {
                        if (a.order === b.order){
                            return 0;
                        }
                        else if (a.order > b.order){
                            return 1;
                        } else if (a.order < b.order){
                            return -1;
                        } else {
                            console.error(`Wrong data: a: ${a.order}, b: ${b.order}`);
                            return 0;
                        }
                      }).map((card) => (
                      <Draggable key={card.id} draggableId={card.id.toString()} index={card.order}>
                        {provided => (
                          <div  {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}>
                              <KanbanCard  
                                title={card.name} description={card.description} 
                                elementType="card" pk={card.id} removeHandler={handleRemove} editHandler={handleEdit}/>
                          </div>
                        )}
                      </Draggable>
                      ))}
                  </>;
        }
        else{
            cards="";
        }
        return cards;

    }

    return (
        <div>
          <h1 className='ps-3 fw-bold'>{kanbanData.name}<Link to={"config"}><i className="bi bi-gear-fill ps-4"></i></Link></h1>
          <div className='d.fluid text-center px-3 w-100'>
            <Row>
              <DragDropContext onDragEnd={handleDrag}>
                <Columns/>
              </DragDropContext>
            </Row>
          </div>
          <ErrorModal></ErrorModal>
        </div>
    )
}

export default Kanban;