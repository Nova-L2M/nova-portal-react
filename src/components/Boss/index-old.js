import countdown from "countdown-updated";
import { auth, db } from "../../firebase/config";
import { doc, Timestamp, updateDoc, getDoc } from "firebase/firestore";

countdown.setLabels(
  ' mil| sec| min| hr| day| week| month| year| decade| century| millennium',
	' mils| secs| mins| hrs| days| weeks| months| years| decades| centuries| millennia',
	'',
	'',
	'',
);

class Boss {
  constructor(parent, data) {
    this.id = data.id;
    this.name = data.name;
    this.level = data.level;
    this.is_server_boss = data.is_server_boss;
    this.is_interval_timer = data.is_interval_timer;
    this.image = `https://nova-l2m.github.io/Nova-Portal-Webflow/Bosses/images/${
      data.image
        ? data.image
            .split(" ")
            .join("")
            .split("Susceptor")
            .join("")
            .toLowerCase()
        : "boss-icon"
    }.png`;
    this.interval = data.interval;
    this.last_killed = data.last_killed;
    this.next_spawn = data.next_spawn;
    this.spawns = data.spawns;
    this.rarity = data.rarity;
    this.rate = data.rate;
    this.updated_by = data.updated_by;
    this.spawns = data.is_interval_timer ? null : data.spawns;
    this.parent = parent;
    this.timer = null;
    this.element = this.render();
  }
  render() {
    let times = this.calculateTimes();
    let html = `
      <tr class="boss-row" id="${this.id}" data-timestamp="${times.nextSpawnTimestamp}">
        <td>
          <div class="td-row">
            <div class="boss-avatar-wrapper${(this.rarity === 'legendary' && this.is_server_boss) ? ' fire' : ''}">
              <img src="${this.image}" class="boss-avatar" />
            </div>
            <div class="boss-name-wrapper">
              <h4 class="boss-name">${this.name}</h4>
              <div class="boss-details">
                <div class="boss-type">
                  ${this.is_server_boss ? "Server" : "World"}
                </div> 
                ·                
                <div class="boss-rarity">${this.rarity}</div>
                ·
                <div class="boss-interval">
                  ${this.rate}% Every ${this.interval} Hrs
                </div>
              </div>
            </div>
          </div>
        </td>
        <td>
          <div class="td-column">
            ${
              this.is_interval_timer
                ? `
              <h5 class="subdue">Last Kill</h5>
              <h5 data-last-killed="${times.lastKilledTimestamp}">${times.lastKilled}</h5>
              <h5 class="updatedby" data-updated-by="${times.updatedBy}">Updated By ${times.updatedBy}</h5>
              `
                : ""
            }
          </div>
        </td>
        <td>
          <div class="td-column">
            <h5 class="subdue">Next Spawn</h5>
            <h5 data-next-spawn="${times.nextSpawnTimestamp}">${times.nextSpawn}</h5>
            <h5 class="updatedby">${this.rate}% Chance</h5>
          </div>
        </td>
        <td>
          <div class="countdown" data-countdown="${this.id}">
            ${
              '--'
            }
          </div>
        </td>
      </tr>
    `;
    this.parent.insertAdjacentHTML("beforeend", html);
    let newElement = document.getElementById(this.id);
    let timerId = countdown(
      new Date(times.nextSpawn), 
      (ts) => {
        let countdown = ts.toHTML();
        let timer = newElement.querySelector(`[data-countdown="${this.id}"]`);
        if (ts.value > 0) {
            timer.innerHTML = `SPAWNED!`;
        }
        else {
          timer.innerHTML = countdown;
        }
      },
      countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS,
      2
    );
    this.timer = timerId;
    // create a modal that opens when the boss is clicked
    if (this.is_interval_timer) {
      newElement.addEventListener("click", () => {
        console.log(`clicked ${this.name}`);
        this.openModal();
      });
    }
    return newElement;
  }
  openModal() {
    // get the modal and modal content
    let modal = document.getElementById("boss-modal");
    let modalContent = modal.querySelector(".modal-content");
    let modalClose = modal.querySelector(".modal-close");
    let modalBG = modal.querySelector("[data-modal-bg]");
    let modalName = modal.querySelector("[data-modal-title]");
    let modalDate = modal.querySelector("[data-modal-date]");
    let modalTime = modal.querySelector("[data-modal-time]");
    let modalSubmit = modal.querySelector("[data-modal-submit]");

    // reset the modal
    modalName.innerHTML = "";
    modalDate.value = "";
    modalTime.value = "";
    // clear the event listener on the submit button so it doesn't keep adding new event listeners
    modalSubmit.removeEventListener("click", this.submitModal);
    // clear the event listener on the close button so it doesn't keep adding new event listeners
    modalClose.removeEventListener("click", this.closeModal);
    // clear the event listener on the background so it doesn't keep adding new event listeners
    modalBG.removeEventListener("click", this.closeModal);

    // set the modal date and time to the current time
    let now = new Date();
    modalDate.value = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    // time format should be h:mm pm
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let time = hours + ":" + minutes + " " + ampm;
    modalTime.value = time;

    // set the modal content
    modalName.innerHTML = `Edit Timer for ${this.name}`;

    // animate the modal to open
    modal.classList.add("show");
    modalContent.classList.add("show");
    // animate the modal to close if the user clicks the close button or the background
    modalClose.addEventListener("click", () => {
      modal.classList.remove("show");
      modalContent.classList.remove("show");
    }); 
    modalBG.addEventListener("click", () => {
      modal.classList.remove("show");
      modalContent.classList.remove("show");
    });

    // set the modal submit button to update the boss
    modal.querySelector("[data-modal-submit]").addEventListener("click", async () => {
      let date = modalDate.value;
      let time = modalTime.value;
      let timestamp = new Date(`${date} ${time}`).getTime() / 1000;
      //turn the interval from hours into seconds
      let interval = this.interval * 60 * 60;
      let nextSpawn = timestamp + interval;
      //get the uid of the current user
      let uid = auth.currentUser.uid;
      //use the uid to get the username of the current user
      let docRef = doc(db, "users", uid);
      let userObject = await getDoc(docRef);
      let updatedBy = userObject.data().username;
      this.updateDatabase({
        server: 4,
        last_killed: new Timestamp(timestamp, 0),
        next_spawn: new Timestamp(nextSpawn, 0),
        updated_by: updatedBy
      }, 4);
      modal.classList.remove("show");
      modalContent.classList.remove("show");
    });
  }
  updateDatabase(data, server) {
    this.last_killed[server - 1] = data.last_killed;
    this.next_spawn[server - 1] = data.next_spawn;
    this.updated_by[server - 1] = data.updated_by;
    let updatedData = {
      last_killed: this.last_killed,
      next_spawn: this.next_spawn,
      updated_by: this.updated_by
    };
    console.log(updatedData);
    // update the boss on the server
    let bossRef = doc(db, "bosses", this.id);
    //updateDoc(bossRef, updatedData);
  }
  updateGUI(data) {
    window.clearInterval(this.timer);
    this.last_killed = data.last_killed;
    this.next_spawn = data.next_spawn;
    this.updated_by = data.updated_by;
    let times = this.calculateTimes();
    this.element.querySelector("[data-timestamp]").setAttribute = times.nextSpawn;
    this.element.querySelector("[data-last-killed]").innerHTML = times.lastKilled;
    this.element.querySelector("[data-next-spawn]").innerHTML = times.nextSpawn;
    this.element.querySelector("[data-updated-by]").innerHTML = times.updatedBy;
    let timerId = countdown(
      new Date(times.nextSpawn), 
      (ts) => {
        let countdown = ts.toHTML();
        let timer = this.element.querySelector(`[data-countdown="${this.id}"]`);
        if (ts.value > 0) {
            timer.innerHTML = `SPAWNED!`;
        }
        else {
          timer.innerHTML = countdown;
        }
      },
      countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS,
      2
    );
    this.timer = timerId;
  }
  calculateTimes() {
    let server, lastKilledTimestamp, lastKilled, nextSpawnTimestamp, nextSpawn, updatedBy;
    if (this.is_interval_timer) {
      server = 3;
      lastKilledTimestamp = this.is_server_boss ? this.last_killed[server].seconds : this.last_killed.seconds;
      lastKilled = new Date(lastKilledTimestamp*1000).toLocaleString();
      nextSpawnTimestamp = this.is_server_boss ? this.next_spawn[server].seconds : this.next_spawn.seconds;
      nextSpawn = new Date(nextSpawnTimestamp*1000).toLocaleString();
      updatedBy = this.is_server_boss ? this.updated_by[3] : this.updated_by;
    } else {
      lastKilled = "--";
      lastKilledTimestamp = "--";
      
      let recurringTimesArray = this.spawns;
      // get timestamp for right now
      let now = Math.floor(Date.now() / 1000);
      // For each object in the array, calculate the next time it will occur. Save the next time in a new array.
      let nextTimesArray = [];
      recurringTimesArray.forEach((time) => {
          let nextTime = time.start;
          while (nextTime < now) {
              nextTime += time.interval;
          }
          nextTimesArray.push(nextTime);
      });
      // Get the smallest value in the array
      nextSpawnTimestamp = Math.min(...nextTimesArray);
      // Convert the timestamp to a date
      nextSpawn = new Date(nextSpawnTimestamp * 1000).toLocaleString();
    }
    return {
      lastKilled: lastKilled,
      lastKilledTimestamp: lastKilledTimestamp,
      nextSpawn: nextSpawn,
      nextSpawnTimestamp: nextSpawnTimestamp,
      updatedBy: updatedBy
    };
  }
}

export default Boss;
