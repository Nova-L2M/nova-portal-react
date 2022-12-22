import styled from 'styled-components';
import { Container, Row, Column } from '../../App';

const BossModal = () => {
    return (
        <Modal id="boss-modal" className="modal">
            <div className="modal-content">
                <span className="modal-close">&times;</span>
                <p>Some text in the Modal..</p>
            </div>
        </Modal>
    );
}

const Bosses = () => {
    return (
        <Container>
            <BossModal />
            <Row>
              <Column>
                <table id="boss-list" cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Boss</th>
                      <th>Last</th>
                      <th>Next</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody id="boss-list-body">
                  </tbody>
                </table>
              </Column>
            </Row>
          </Container>
    );
}

const Modal = styled.div`
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  &.show {
    display: block;
  }
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }
  .modal-close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  .modal-close:hover,
  .modal-close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;


export default Bosses;