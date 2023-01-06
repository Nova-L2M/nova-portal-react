import React from 'react';
import { Container, Row, Column } from '../../App';
import BossModal from '../../components/BossModal';
import { collection, query, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import Isotope from "isotope-layout";
import Boss from '../../components/Boss';


class Bosses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bosses: []
    };
    this.fetchBosses();
  }
  componentDidMount() {
    this.fetchBossChanges();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  async fetchBosses() {
    let bosses = [];
    const q = query(collection(db, "bosses"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let key = doc.id;
      let bossObject = {
        id: key,
        name: doc.data().name,
        image: doc.id,
        level: doc.data().level,
        is_server_boss: doc.data().is_server_boss,
        is_interval_timer: doc.data().is_interval_timer,
        interval: doc.data().interval,
        last_killed: doc.data().last_killed,
        next_spawn: doc.data().next_spawn,
        spawns: doc.data().spawns,
        rarity: doc.data().rarity,
        rate: doc.data().rate,
        updated_by: doc.data().updated_by
      };
      bosses.push(bossObject);
      //if it's the last boss, set the state
      if (querySnapshot.size === bosses.length) {
        this.setState({ bosses: bosses });
      }
    });
      
  }
  fetchBossChanges() {
    const q = query(collection(db, "bosses"));
    this.unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          console.log("Modified Boss: ", change.doc.data());
          let key = change.doc.id;
          // change the boss in the state
          let bossObject = {
            id: key,
            name: change.doc.data().name,
            image: change.doc.id,
            level: change.doc.data().level,
            is_server_boss: change.doc.data().is_server_boss,
            is_interval_timer: change.doc.data().is_interval_timer,
            interval: change.doc.data().interval,
            last_killed: change.doc.data().last_killed,
            next_spawn: change.doc.data().next_spawn,
            spawns: change.doc.data().spawns,
            rarity: change.doc.data().rarity,
            rate: change.doc.data().rate,
            updated_by: change.doc.data().updated_by
          };
          let bossIndex = this.state.bosses.findIndex((boss) => boss.id === key);
          let bosses = this.state.bosses;
          bosses[bossIndex] = bossObject;
          this.setState((state) => (
            { 
              bosses: [
                ...state.bosses.slice(0, bossIndex),
                bossObject,
                ...state.bosses.slice(bossIndex + 1),
              ], 
            }
          ));
        }
      });
    });
  }
  render() {
    if (this.state.bosses.length === 0) {
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
                  <tr>
                    <td colSpan="4">Loading...</td>
                  </tr>
                </tbody>
              </table>
            </Column>
          </Row>
        </Container>
      );
    }
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
                    {this.state.bosses.map((boss) => (
                      <Boss key={boss.id} boss={boss} />
                    ))}
                  </tbody>
                </table>
              </Column>
            </Row>
          </Container>
    );
  }
}

function setTable(callback) {
  // Set the width for each column in the table header
  let headerArray = document.querySelectorAll("th");
  headerArray.forEach((header) => {
    let width = header.offsetWidth;
    header.style.width = `${width}px`;
  });
  // TODO: Set the width for each column
  let rowArray = document.querySelectorAll(".boss-row");
  rowArray.forEach((row) => {
    let columnArray = row.querySelectorAll("td");
    columnArray.forEach((column) => {
      let width = column.offsetWidth;
      column.style.width = `${width}px`;
    });
  });
  if (callback) {
    callback();
  }
}
function initIsotope() {
  // init Isotope
  console.log('init isotope');
  var iso = new Isotope('#boss-list', {
    itemSelector: '.boss-row',
    layoutMode: 'vertical',
    getSortData: {
      timestamp: '[data-timestamp] parseInt'
    }
  });
  // sort by timestamp
  iso.arrange({ sortBy: 'timestamp' });
  // adjust height of boss-list-body
  let bossListBody = document.getElementById("boss-list-body");
  let bossList = document.getElementById("boss-list");
  bossListBody.style.height = `${bossList.offsetHeight}px`;
}

export default Bosses;