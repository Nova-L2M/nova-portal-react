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
      bosses: [],
      server: 4,
      isotope: null,
    };
    this.fetchBosses();
  }
  componentDidMount() {
    this.fetchBossChanges();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  componentDidUpdate(prevProps, prevState) {
    let allChildrenUpdated = true;

    React.Children.forEach(this.props.children, (child, index) => {
      if (child.props !== prevProps.children[index].props) {
        allChildrenUpdated = false;
      }
    });

    if (allChildrenUpdated) {
      // all the children have updated, so run your sorting function
      this.sortBosses();
      console.log("The Bosses component has updated.")
      // wait a quarter second to make sure the DOM has updated
      setTimeout(() => {
        this.sortBosses();
      }, 100);
    }
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
          let newBosses = this.state.bosses.slice();
          let bossIndex = newBosses.findIndex((boss) => boss.id === key);
          newBosses[bossIndex] = {
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
          this.setState(
            { bosses: newBosses },
            () => {
              console.log("Bosses state has been updated.");
            });
        }
      });
    });
  }
  sortBosses() {
    // initialize Isotope if it hasn't been already
    if (this.state.isotope === null) {
      console.log(`The Boss table component has initially mounted.`);
      this.prepIsotope();
      this.setState({
        isotope: new Isotope("#boss-list-body", {
          itemSelector: ".boss-row",
          layoutMode: "vertical",
          getSortData: {
            next_spawn: "[data-timestamp] parseInt"
          },
          sortBy: "next_spawn",
          sortAscending: true,
        }),
      });
    }
    // if it has been initialized, sort the items by next_spawn
    else {
      // use the updateSortData method on the isotope instance
      this.state.isotope.updateSortData(this.state.isotope.getItemElements());
      // sort the items by next_spawn
      this.state.isotope.arrange({
        sortBy: "next_spawn",
        sortAscending: true,
      });
    }
  }
  prepIsotope() {
    // determine the width of each column in the table and set their width inline
    let table = document.getElementById("boss-list");
    let columns = table.querySelectorAll("th");
    let columnWidths = [];
    columns.forEach((column) => {
      columnWidths.push(column.offsetWidth);
    });
    // set the width of each column in the header
    columns.forEach((column, index) => {
      column.style.width = columnWidths[index] + "px";
    });
    // set the width of each column in each row
    let rows = table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      let columns = row.querySelectorAll("td");
      columns.forEach((column, index) => {
        column.style.width = columnWidths[index] + "px";
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
                      <Boss key={boss.id} boss={boss} server={this.state.server} />
                    ))}
                  </tbody>
                </table>
              </Column>
            </Row>
          </Container>
    );
  }
}

export default Bosses;