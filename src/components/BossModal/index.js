import React from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import timepicker from 'timepicker'
import 'timepicker/jquery.timepicker.css';

class BossModal extends React.Component{
    componentDidMount(){
        this.initDatepicker();
      }

    initDatepicker(){
        $(this.refs.timepicker).timepicker({
            //timeFormat: 'h:mm p',
            //interval: 30,
            //minTime: '1',
            //maxTime: '6:00pm',
            //defaultTime: 'now',
            //startTime: '8:00am',
            dynamic: true,
            dropdown: true,
            scrollbar: true
        });
    }

    handleChange = (e) => {
        console.log(e.currentTarget.value)
    }
    render() {
        return (
            <Modal id="boss-modal" className="modal">
                <ModalBackground data-modal-bg />
                <div className="modal-content">
                    <ModalTop>
                        <h2 data-modal-title>Edit Timer for Boss Name</h2>
                    </ModalTop>
                    <ModalBody>
                        <p>Enter New Killed Date/Time</p>
                        <InputsWrapper>
                            <Input type="text" data-modal-date/>
                            <Input
                                type="text"
                                ref='timepicker'
                                data-modal-time
                            />
                        </InputsWrapper>
                        <SubmitButton data-modal-submit>Update Timer</SubmitButton>
                        <OrWrapper>
                            <OrLine></OrLine>
                            <OrText>OR</OrText>
                            <OrLine></OrLine>
                        </OrWrapper>
                        <SubmitButton className="ghost" data-modal-skip>Skipped</SubmitButton>
                        <Description>If the boss didn't spawn, you can skip the timer to the next expected time. You can also use this if the boss was killed right away.</Description>
                        <SubmitButton className="red" data-modal-remove>Remove Timer</SubmitButton>
                        <Description>As a LAST RESORT, you can remove the timer for this boss. Only use this option for server reset.</Description>
                    </ModalBody>
                    <span className="modal-close">&times;</span>
                </div>
            </Modal>
        );
    }
}

const Modal = styled.div`
  display: none;
  align-items: start;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  &.show {
    display: flex;
  }
  .modal-content {
    background-color: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255,255,255,0.2);
    border-top: 3px solid #F6CA82;
    width: 100%;
    max-width: 500px;
    margin: 20px;
    margin-top: 100px;
    position: relative;
  }
  .modal-close {
    color: #aaa;
    position: absolute;
    top: -13px;
    right: -12px;
    font-size: 28px;
    font-weight: bold;
    transition: all ease .2s;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #F6CA82;
    border-radius: 99px;
    padding-top: 1px;
    background-color: #000;
    font-weight: 100;
  }
  .modal-close:hover,
  .modal-close:focus {
    color: #F6CA82;
    text-decoration: none;
    cursor: pointer;
  }
`;

const ModalBackground = styled.div`
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`

const ModalTop = styled.div`
    background-color: rgba(255,255,255,0.1);
    padding: 10px 20px;
    h2 {
        font-size: 14px;
        font-weight: 400;
        text-transform: uppercase;
    }
`

const ModalBody = styled.div`
    padding: 20px;
    font-size: 12px;
    display:flex;
    flex-direction: column;
    row-gap: 15px;
`
const InputsWrapper = styled.div`
    display: flex;
    column-gap: 20px;
`
const Input = styled.input`
    padding: 10px 20px;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 3px;
    background-color: rgba(0,0,0,0.2);
    color: #fff;
    font-size: 12px;
    font-weight: 200;
    width: 100%;
    cursor: pointer;
    &:focus {
        outline: none;
    }
`
const SubmitButton = styled.div`
    padding: 10px 20px;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 999px;
    background-color: rgb(199 96 46 / 80%);
    color: #fff;
    font-size: 12px;
    font-weight: 200;
    width: 100%;
    cursor: pointer;
    transition: all ease .2s;
    text-transform: uppercase;
    &:focus {
        outline: none;
    }
    &:hover {
        background: rgb(199 96 46 / 100%);
    }
    &.ghost {
        background-color: transparent;
        color: #fff;
        border: 1px solid rgb(199 96 46 / 80%);
        color: #F6CA82;
        &:hover {
            background: rgb(199 96 46 / 80%);
            color: #fff;
        }
    }
    &.red {
        background-color: transparent;
        color: rgb(199 46 46 / 100%);
        border: 1px solid rgb(199 46 46 / 100%);
        &:hover {
            background: rgb(199 46 46 / 100%);
            color: #fff;
        }
    }

`
const OrWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
`
const OrLine = styled.div`
    flex: 1 0 auto;
    height: 1px;
    background-color: rgba(255,255,255,0.2);
`
const OrText = styled.div`
    flex: 0 1 auto;
    font-size: 12px;
    font-weight: 200;
    color: #FFF;
    text-transform: uppercase;
`
const Description = styled.div`
    margin-top: -5px;
    margin-bottom: 5px;
    font-size: 12px;
    font-weight: 200;
    color: #FFF;
    text-align: center;
    font-style: italic;
`
export default BossModal;