import countdown from "countdown-updated";
import date from "date-and-time";

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
    let server, lastKilledTimestamp, lastKilled, nextSpawnTimestamp, nextSpawn, updatedBy;
    if (this.is_interval_timer) {
      server = 3;
      lastKilledTimestamp = this.is_server_boss ? this.last_killed[server].seconds : this.last_killed.seconds;
      lastKilled = new Date(lastKilledTimestamp*1000).toLocaleString();
      nextSpawnTimestamp = this.is_server_boss ? this.next_spawn[server].seconds : this.next_spawn.seconds;
      nextSpawn = new Date(nextSpawnTimestamp*1000).toLocaleString();
      updatedBy = this.is_server_boss ? this.updated_by[server] : this.updated_by;
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

    let html = `
      <tr class="boss-row" id="${this.id}" data-timestamp="${nextSpawnTimestamp}">
        <td>
          <div class="td-row">
            <div class="boss-avatar-wrapper${(this.rarity == 'legendary' && this.is_server_boss) ? ' fire' : ''}">
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
              <h5 data-last-killed="${lastKilledTimestamp}">${lastKilled}</h5>
              <h5 class="updatedby" data-updated-by="${updatedBy}">Updated By ${updatedBy}</h5>
              `
                : ""
            }
          </div>
        </td>
        <td>
          <div class="td-column">
            <h5 class="subdue">Next Spawn</h5>
            <h5 data-next-spawn="${nextSpawnTimestamp}">${nextSpawn}</h5>
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
      new Date(nextSpawn), 
      (ts) => {
        let countdown = ts.toHTML();
        let timer = newElement.querySelector(`[data-countdown="${this.id}"]`);
        if (ts.value > 0) {
            timer.innerHTML = `${countdown}`;
        }
        else {
          timer.innerHTML = countdown;
        }
      },
      countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS,
      2
    );
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

    // reset the modal
    modalName.innerHTML = "";
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
    modal.querySelector("[data-modal-submit]").addEventListener("click", () => {
      let date = modalDate.value;
      let time = modalTime.value;
      let timestamp = new Date(`${date} ${time}`).getTime() / 1000;
      this.updateBoss({
        last_killed: {
          seconds: timestamp,
          nanoseconds: 0,
        },
        next_spawn: this.next_spawn,
        updated_by: this.updated_by,
      });
      modal.classList.remove("show");
      modalContent.classList.remove("show");
    });
    
  }
  updateBoss(data) {
    this.last_killed = data.last_killed;
    this.next_spawn = data.next_spawn;
    this.updated_by = data.updated_by;
    this.updateServer(3);
  }
  updateServer(server) {
    console.log(`Rerendering ${this.name} to Server #${server}`);
    let lastKilled = this.last_killed[server].seconds;
    lastKilled = new Date(lastKilled).toLocaleString();
    let nextSpawn = this.next_spawn[server].seconds;
    nextSpawn = new Date(nextSpawn).toLocaleString();
    let updatedBy = this.updated_by[server];
    this.element.querySelector("[data-last-killed]").innerHTML = lastKilled;
    this.element.querySelector("[data-next-spawn]").innerHTML = nextSpawn;
    this.element.querySelector("[data-updated-by]").innerHTML = `Updated By ${updatedBy}`;
  }
}

export default Boss;
