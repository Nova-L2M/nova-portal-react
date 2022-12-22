import countdown from "countdown-updated";

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
    this.parent = parent;
    this.timer = null;
    this.element = this.render();
  }
  render() {
    let server, lastKilled, nextSpawnTimestamp, nextSpawn, updatedBy;
    if (this.is_server_boss) {
      server = 3;
      lastKilled = this.last_killed[server].seconds;
      lastKilled = new Date(lastKilled*1000);
      nextSpawnTimestamp = this.next_spawn[server].seconds;
      nextSpawn = new Date(nextSpawnTimestamp*1000);
      updatedBy = this.updated_by[server];
    } else {
      nextSpawn = "--";
      nextSpawnTimestamp = "--";
    }
    let html = `
      <tr class="boss-row" id="${this.id}" data-timestamp="${nextSpawnTimestamp}">
        <td>
          <div class="td-row">
            <div class="boss-avatar-wrapper">
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
              this.is_server_boss
                ? `
              <h5 class="subdue">Last Kill</h5>
              <h5 data-last-killed="${this.last_killed[server].seconds}">${lastKilled.toLocaleString()}</h5>
              <h5 class="updatedby" data-updated-by="${updatedBy}">Updated By ${updatedBy}</h5>
              `
                : ""
            }
          </div>
        </td>
        <td>
          <div class="td-column">
            <h5 class="subdue">Next Spawn</h5>
            <h5 data-next-spawn="${nextSpawnTimestamp}">${nextSpawn.toLocaleString()}</h5>
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
    countdown(
      new Date(nextSpawn), 
      (ts) => {
        let countdown = ts.toHTML();
        let timer = newElement.querySelector(`[data-countdown="${this.id}"]`);
        if (ts.value > 0) {
          timer.innerHTML = countdown;
          // timer.innerHTML = "Spawned!";
        }
        else {
          timer.innerHTML = countdown;
        }
      },
      countdown.HOURS | countdown.MINUTES | countdown.SECONDS
    );
    // create a modal that opens when the boss is clicked
    newElement.addEventListener("click", () => {
      console.log(`clicked ${this.name}`);
      this.openModal();
    });
    return newElement;
  }
  openModal() {
    let modal = document.getElementById("boss-modal");
    let modalContent = modal.querySelector(".modal-content");
    let modalClose = modal.querySelector(".modal-close");
    // animate the modal to open
    modal.classList.add("show");
    modalContent.classList.add("show");
    // animate the modal to close
    modalClose.addEventListener("click", () => {
      modal.classList.remove("show");
      modalContent.classList.remove("show");
    } );
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
