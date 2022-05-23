import React, { useMemo } from 'react'
import styled from 'styled-components';
import {BiChevronLeft, BiChevronRight} from 'react-icons/bi';
import { useRecoilState } from 'recoil';
import { selectedDateState, isTodoModal } from '../store';

const CalendarBox= styled.div`
    width: 100%;
    max-width:900px;
    margin:0 auto;
    padding: 24px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    border-radius:16px;
    background-color: rgb(40, 39, 42);
`;
const CalendarHeader = styled.div`
    display:flex;
    flex-flow:wrap;
`;
const CalendarTitle = styled.h1`
    min-width:215px;
    margin: 0;
    padding: 8px 24px;
    font-size: 24px;
    font-weight: normal;
    text-align: center;
    color: #F8F7FA;
`;
const ArrowButton = styled.button`
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  background-color: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #F8F7FA;
`;
const Table = styled.table`
    margin-top:25px;
    border-collapse: collapse;
    width: 100%;
    height: 100%;
    border-spacing: 0;
`;
const TableHeader = styled.thead`
  padding-block: 12px;
  th {
    padding-block: 12px;
    font-weight: normal;
    color: #F8F7FA;
  }
`;
const TableBody = styled.tbody`
  td{
    width:128px;
    height:128px;
    text-align: center;
    color: #C9C8CC;
    padding: 8px;
    position: relative;
    border-top:1px solid #aaa;

    &:hover{
        & button{
            display:block;
        }
    }
  }
`;
const DisplayDate = styled.div`
    color: ${({ isToday }) => isToday && '#F8F7FA'};
    background-color: ${({ isToday }) => isToday && '#7047EB'};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    align-self: flex-end;
    position: absolute;
    top: 8px;
    right: 8px;
    width: 36px;
    height: 36px;
    cursor: pointer;
`;
const DateButton = styled.button`
    position:absolute;
    left:0;
    top:12px;
    width:24px;
    height:24px;
    display:none;
    font-size:20px;
    color:#000;
    border:1px solid #000;
    border-radius:3px;
    cursor:pointer;
`;
const Layer = styled.div`
  position:absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  &:after{
      content:'';
      position:fixed;
      left:0;
      top:0;
      width:100%;
      height:100%;
      background-color:rgba(0,0,0,0.4);
  }
`;
const LayerContent = styled.div`
  position:fixed;
  left:50%;
  top:50%;
  width:500px;
  height:300px;
  background-color:#000;
  border-radius:15px;
  transform:translate(-50%, -50%);
  z-index:10
`;

const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MONTHS = ['January','February','March','April','May','June','July',"August", "September", "October", "November", "December"];

const isSameDay = (a, b) => {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}  

function Calendar() {

    const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);
    const [isModal, setIsModal] = useRecoilState(isTodoModal);
    const {year, month, firstDay, lastDay} = useMemo(()=>{
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        
        return({
            year,
            month,
            firstDay : new Date(year, month, 1),
            lastDay : new Date(year, month + 1, 0)
        });
        
    },[selectedDate])
    const selectDate = (date) => {
        setIsModal(!isModal)
        // setSelectedDate(date)
    }
    const handleModal = () => {
        setIsModal(!isModal)
    }
    const pad = () => [...Array(firstDay.getDay()).keys()].map((p) => <td key={`pad_${p}`}></td>);
    const range = () => [...Array(lastDay.getDate()).keys()].map((d) => {
        const thisDay = new Date(year, month, d + 1);
        const today = new Date();

        return(
            <td key={`range_${d}`} >
                <DisplayDate
                    onClick={() => selectDate(thisDay)}
                    isToday={isSameDay(today, thisDay)}
                    >{new Date(year, month, d + 1).getDate()}
                </DisplayDate>
                <DateButton type='button' onClick={handleModal}>+</DateButton>
            </td>
        )
    });
    const render = () => {
        const items = [...pad(), ...range()];
        const weeks = Math.ceil(items.length / 7);
        return [...Array(weeks).keys()].map((week) => (
          <tr key={`week_${week}`}>
            {items.slice(week * 7, week * 7 + 7)}
          </tr>
        ));
    }
    return (
        <CalendarBox>
            <CalendarHeader>
                <ArrowButton onClick={()=>{
                    selectDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))
                }}>
                    <BiChevronLeft/>
                </ArrowButton>
                <CalendarTitle>{`${MONTHS[month]} ${year}`}</CalendarTitle>
                <ArrowButton onClick={()=>{
                    selectDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))
                }}>
                    <BiChevronRight/>
                </ArrowButton>
            </CalendarHeader>
            <Table>
                <TableHeader>
                    <tr>
                        {DAYS.map((day, index)=>(
                            <th>{day}</th>
                        ))}
                    </tr>
                </TableHeader>
                <TableBody>
                    {render()}
                </TableBody>
            </Table>
            {isModal && 
            <Layer>
                <LayerContent>
                    <p></p>
                    <button type='button' onClick={handleModal}>닫기</button>
                </LayerContent>
            </Layer>}
        </CalendarBox>
    )
}

export default Calendar