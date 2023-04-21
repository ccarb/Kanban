import React, { useEffect, useState } from 'react';
import { useLoaderData} from 'react-router';
import { KANBAN_API_URL } from '../../constants/apiUrls';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import KanbanCard from './kanbanCard';
import { BOARD_API_URL } from '../../constants/apiUrls';
import ErrorModal from '../../components/errorModal';
import errorMessages from '../../constants/errorMessages';
import FormModal from '../../components/formModal';
import KanbanCardForm from './kanbanCardForm';

function Kanban(props){
    const boardId = useLoaderData();

    const [kanbanData, setKanbanData] = useState({});

    useEffect(()=>{
        function getKanbanData(){
            return fetch(KANBAN_API_URL+boardId).then(response => { if (response.ok) {return response.json()} else {throw new Error(errorMessages.BACKEND_NOT_OK)}}).then(data => setKanbanData(data)).catch((error) => {console.log(error);document.dispatchEvent(new CustomEvent("error", {detail: error}))});
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
        fetch(BOARD_API_URL+'columns/cards/'+cardId, {"method": "DELETE"}).catch(() => revertDelete());
        function revertDelete(){
          if (cards.indexOf(removedCard) > -1){
            cards=cards.concat(removedCard);
            kDataCopy.columns[columnArrPos].cards=cards;
            setKanbanData(kDataCopy);
          }
        }
    };
    
    function Columns(props){
        let cols;
        if (kanbanData.columns){
            cols=(kanbanData.columns.map(column => (
                <Col key={column.id}>
                  <h3 className='fw-bold mb-3'>{column.name}</h3>
                  <Cards cards={column.cards}/>
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
                    {props.cards.map(card => (<KanbanCard key={card.id} title={card.name} description={card.description} elementType="card" pk={card.id} removeHandler={handleRemove}/>))}
                    <FormModal form={<KanbanCardForm/>} createdEntity="Card"><p className='text-secondary'>Create new card...</p></FormModal>
                  </>;
        }
        else{
            cards="";
        }
        return cards;

    }

    return (
        <>
          <h1 className='ps-3 fw-bold'>{kanbanData.name}</h1>
          <div className='d.fluid text-center px-3 w-100'>
            <Row>
              <Columns/>
            </Row>
          </div>
          <ErrorModal></ErrorModal>
        </>
    )
}

export default Kanban;