import styled from 'styled-components';
import { Container, Row, Column } from '../../App';
import BossModal from '../../components/BossModal';


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


export default Bosses;