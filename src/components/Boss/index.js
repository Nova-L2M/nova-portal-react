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
    this.element = this.render();
  }
  render() {
    let server, lastKilled, nextSpawn, updatedBy;
    if (this.is_server_boss) {
      server = 2;
      lastKilled = this.last_killed[server].__time__;
      lastKilled = new Date(lastKilled).toLocaleString();
      nextSpawn = this.next_spawn[server].__time__;
      nextSpawn = new Date(nextSpawn).toLocaleString();
      updatedBy = this.updated_by[server];
    } else {
      nextSpawn = "--";
    }
    let html = `
      <tr class="boss-row" id="${this.id}">
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
              <h5>${lastKilled}</h5>
              <h5 class="updatedby">Updated By ${updatedBy}</h5>
              `
                : ""
            }
          </div>
        </td>
        <td>
          <div class="td-column">
            <h5 class="subdue">Next Spawn</h5>
            <h5>${nextSpawn}</h5>
            <h5 class="updatedby">${this.rate}% Chance</h5>
          </div>
        </td>
        <td>
          Status
        </td>
      </tr>
    `;
    this.parent.insertAdjacentHTML("beforeend", html);
    let newElement = document.getElementById(this.id);
    return newElement;
  }
  updateServer(server) {
    console.log(`Rerendering ${this.name} to Server #${server}`);
  }
}

export default Boss;
