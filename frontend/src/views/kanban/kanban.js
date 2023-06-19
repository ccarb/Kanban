import { useEffect, useState } from 'react';
import {useLoaderData} from 'react-router';
import {Link, useNavigate} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { KANBAN_API_URL } from '../../constants/apiUrls';
import { BOARD_API_URL } from '../../constants/apiUrls';
import KanbanCard from './kanbanCard';
import ErrorModal from '../../components/errorModal';
import FormModal from '../../components/formModal';
import Header from '../../components/header';
import errorMessages from '../../constants/errorMessages';
import KanbanCardForm from './kanbanCardForm';

function Kanban(props){
    const navigate = useNavigate();
    const boardId = useLoaderData();

    const [kanbanData, setKanbanData] = useState({});

    useEffect(()=>{
        function getKanbanData(){
            return fetch(KANBAN_API_URL+boardId)
            .then(response => { if (response.ok) {return response.json()} else {throw new Error(errorMessages.BACKEND_NOT_OK)}})
            .then(data => setKanbanData(data))
            .catch((error) => {console.error(error);document.dispatchEvent(new CustomEvent("error", {detail: error}))});
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
        if (newCard.dueDate===''){
            delete newCard.dueDate;
        }
        if (newCard.cover==='') {
            delete newCard.cover;
        } else {
            form.Card.forEach((input) => {if (input.name==='cover'){newCard.cover = input.files[0]}});
        }
        newCard = {...newCard, ...additionalInfo};
        let kDataCopy = {...kanbanData};
        let columnArrPos = kDataCopy.columns.findIndex(column => column.id === newCard.column);
        newCard.order=kDataCopy.columns[columnArrPos].cards.length

        const formData = new FormData();        
        for (const [key, value] of Object.entries(newCard)){
            formData.append(key, value);
        }
        fetch(BOARD_API_URL+'columns/'+newCard.column+'/cards', {
            method: "POST", 
            body: formData
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

    function handleEdit(form, additionalInfo, imgToBeDeleted){
        let kDataCopy = {...kanbanData};
        let allCards = [];
        kDataCopy.columns.forEach(column => {
            allCards=allCards.concat(column.cards);
        });
        let oldCard = allCards.filter(card => card.id === additionalInfo.id);
        let editedCard = {...oldCard[0]};
        form.EditedCard.forEach((input) => editedCard[input.name] = input.value);
        let file;
        if (form.elements.cover){
            file = form.elements.cover.files[0];
            if (form.elements.cover.files[0]){
                editedCard.cover=URL.createObjectURL(file);
            }
        }
                
        let columnArrPos=kDataCopy.columns.findIndex(column => column.id === editedCard.column);
        let cardArrPos=kDataCopy.columns[columnArrPos].cards.findIndex(card => card.id === editedCard.id);
        kDataCopy.columns[columnArrPos].cards[cardArrPos]=editedCard;
        setKanbanData({...kDataCopy});

        if (editedCard.dueDate===''){
            delete editedCard.dueDate
        }

        if (editedCard.cover === null || editedCard.cover === '' || (typeof(editedCard.cover) === 'string' && editedCard.cover.includes('card_covers/'))) {
            delete editedCard.cover;
            if (imgToBeDeleted){
                editedCard.cover='';   
            }
        }

        const formData = new FormData();
        for (const [key, value] of Object.entries(editedCard)){
            if (key==='cover' && value){
                formData.append(key, file)
            } else {
            formData.append(key, value);
            }
        }

        fetch(BOARD_API_URL+'columns/cards/'+additionalInfo.id, {
            method: "PUT", 
            body: formData
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

        let oldKanbanData = JSON.parse(JSON.stringify(kanbanData));        
        let sourceColumn = kanbanData.columns.find(column => column.id === parseInt(source.droppableId, 10));
        let editedCard = sourceColumn.cards.find(card => card.id === parseInt(draggableId,10));
        editedCard.column = parseInt(destination.droppableId);
        let backendPayload;
        // Reorder in same column
        if (destination.droppableId === source.droppableId){
            sourceColumn.cards.splice(source.index, 1);
            sourceColumn.cards.splice(destination.index, 0, editedCard);
            sourceColumn.cards.forEach((card, index) => card.order = index);
            setKanbanData({...kanbanData});
            const sourceColumnPayload = sourceColumn.cards.map((card) => {let {'cover': _, ...cardWithoutCover} = card; return cardWithoutCover})
            backendPayload = [...sourceColumnPayload];
        }
        // Move column then reorder
        else {
            sourceColumn.cards.splice(source.index, 1);
            sourceColumn.cards.forEach((card, index) => card.order = index);
            let destinationColumn = kanbanData.columns.find(column => column.id === parseInt(destination.droppableId, 10));
            destinationColumn.cards.splice(destination.index, 0, editedCard);
            destinationColumn.cards.forEach((card, index) => card.order = index);
            setKanbanData({...kanbanData});
            const sourceColumnPayload = sourceColumn.cards.map((card) => {let {'cover': _, ...cardWithoutCover} = card; return cardWithoutCover})
            const destinationColumnPayload = destinationColumn.cards.map((card) => {let {'cover': _, ...cardWithoutCover} = card; return cardWithoutCover})
            backendPayload = [...sourceColumnPayload, ...destinationColumnPayload];
        }
        
        
        //persist changes
        fetch(`${BOARD_API_URL}columns/cards/reorder`, {
            method: "PUT", 
            headers: new Headers({'content-type': 'application/json'}), 
            body: JSON.stringify(backendPayload)
        })
        .then(response => { 
            if (response.ok) {return 0;} 
            else {throw new Error(errorMessages.BACKEND_NOT_OK);}
        }).catch((error) => {
            console.error(error);
            document.dispatchEvent(new CustomEvent("error", {detail: error}));
            revertDrag()
        })
        // revert if backend not respond
        function revertDrag(){
            setKanbanData({...oldKanbanData})

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
                  <FormModal additionalInfo={{'column': column.id}} form={<KanbanCardForm/>} createdEntity="Card" formHandler={handleCreate}><p className='text-info'>Create new card...</p></FormModal>
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
                              <KanbanCard key={card.id}  
                                card={card} removeHandler={handleRemove} editHandler={handleEdit}/>
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
          <Header>
          <div className='row align-items-center'>
                <div className='col-10 col-md-auto'>
                    <h1 className='ps-3 pt-2 fw-bold'>
                        {`Kanban > ${kanbanData.name}`}    
                    </h1>
                </div>
                <div className='d-none d-md-flex col'>
                    <Link to={"config"} className='text-body'>Settings</Link>
                </div>
                <div className='col-auto d-lg-none' onClick={() => navigate(`/`)}>
                    <i className='bi-arrow-left h1'></i>
                </div>
            </div>
            <div className='row'>
                <Link to={"config"} className='d-md-none'><i className="bi bi-gear-fill ps-3 text-dark h1"></i></Link>
            </div>
            
          </Header>
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