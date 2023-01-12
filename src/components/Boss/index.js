import countdown from "countdown-updated";
import { auth, db } from "../../firebase/config";
import { doc, Timestamp, updateDoc, getDoc } from "firebase/firestore";
import React from "react";

countdown.setLabels(
    ' mil| sec| min| hr| day| week| month| year| decade| century| millennium',
      ' mils| secs| mins| hrs| days| weeks| months| years| decades| centuries| millennia',
      '',
      '',
      '',
  );

class Boss extends React.Component {
    constructor(props) {
        super(props);
        this.is_interval_timer = props.boss.is_interval_timer;
        this.image = `https://nova-l2m.github.io/Nova-Portal-Webflow/Bosses/images/${props.boss.image
            ? props.boss.image
                .split(" ")
                .join("")
                .split("Susceptor")
                .join("")
                .toLowerCase()
            : "boss-icon"
            }.png`;
        this.interval = props.boss.interval;
        this.last_killed = props.boss.last_killed;
        this.next_spawn = props.boss.next_spawn;
        this.spawns = props.boss.spawns;
        this.rarity = props.boss.rarity;
        this.rate = props.boss.rate;
        this.updated_by = props.boss.updated_by;
        this.spawns = props.boss.is_interval_timer ? null : props.boss.spawns;
        this.server = props.server;
        this.state = {
            timer: null,
            sortTable: false,
            server: props.server,
            updated_by: this.getUpdatedBy(),
            last_killed: this.getLastKilled(),
            next_spawn: this.getNextSpawn(),
            last_killed_timestamp: this.getLastKilled(true),
            next_spawn_timestamp: this.getNextSpawn(true),
        };
    }
    getUpdatedBy = () => {
        let updatedBy;
        if (this.props.boss.updated_by) {
            updatedBy = this.props.boss.is_server_boss ? this.props.boss.updated_by[this.props.server - 1] : this.props.boss.updated_by;
        }
        else {
            updatedBy = "Unknown";
        }
        if (updatedBy) {
            return updatedBy;
        }
    }
    getLastKilled = (timestamp) => {
        let lastKilled;
        if (this.props.boss.last_killed) {
            if (this.props.boss.is_interval_timer) {
                lastKilled = this.props.boss.last_killed[this.props.server - 1];
            }
            else {
                lastKilled = this.props.boss.last_killed;
            }
        }
        if (lastKilled) {
            if (timestamp) {
                return lastKilled.seconds;
            }
            else {
                return new Date(lastKilled.seconds * 1000).toLocaleString();
            }
        }
    }
    getNextSpawn = (timestamp) => {
        let nextSpawn, nextSpawnTimestamp;
        if (this.props.boss.is_interval_timer) {
            if (this.props.boss.is_server_boss) {
                nextSpawn = this.props.boss.next_spawn[this.props.server - 1].seconds;
            }
            else {
                nextSpawn = this.props.boss.next_spawn.seconds;
            }
        }
        else {
            let recurringTimesArray = this.props.boss.spawns;
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
            nextSpawn = nextSpawnTimestamp;
        }
        if (nextSpawn) {
            if (timestamp) {
                // console.log(this.props.boss.name, nextSpawn);
                return nextSpawn;
            }
            else {
                return new Date(nextSpawn * 1000).toLocaleString();
            }
        }
        else {
            console.log(`Boss ${this.props.boss.name} has no next spawn time.`)
        }
    }
    shouldComponentUpdate = (nextProps) => {
        if (this.props.boss !== nextProps.boss) {
            console.log(`Boss ${this.props.boss.name} will update`);
            return true;
        }
        else {
            return false;
        }
    }
    componentDidUpdate = (prevProps) => {
        if (this.props.boss !== prevProps.boss) {
            // console.log('Prev props:', prevProps);
            // console.log('Current props:', this.props);
            this.setState({
                server: 4,
                updated_by: this.getUpdatedBy(),
                last_killed: this.getLastKilled(),
                next_spawn: this.getNextSpawn(),
                last_killed_timestamp: this.getLastKilled(true),
                next_spawn_timestamp: this.getNextSpawn(true),
            }, () => {
                // console.log(`Boss ${this.props.boss.name} updated`);
                this.updateTimer();
                this.forceUpdate();
            });
        }
    }
    componentWillUnmount = () => {
        clearInterval(this.timer);
    }
    render = () => {
        return (
            <tr className="boss-row" id={this.props.boss.id} data-timestamp={this.state.next_spawn_timestamp}>
                <td>
                    <div className="td-row">
                        <div className={'boss-avatar-wrapper' + ((this.rarity === 'legendary' && this.props.boss.is_server_boss) ? ' fire' : '')}>
                            <img src={this.image} className="boss-avatar" />
                        </div>
                        <div className="boss-name-wrapper">
                            <h4 className="boss-name">{this.props.boss.name}</h4>
                            <div className="boss-details">
                                <div className="boss-type">{this.props.boss.is_server_boss ? "Server" : "World"}</div>
                                ·
                                <div className="boss-rarity">{this.props.boss.rarity}</div>
                                ·
                                <div className="boss-interval">{this.props.boss.rate}% Every {this.props.boss.interval} Hrs</div>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div className="td-column">
                        {
                            this.is_interval_timer
                                ? (
                                    <>
                                        <h5 className="subdue">Last Kill</h5>
                                        <h5 data-last-killed={this.state.last_killed_timestamp}>{this.state.last_killed}</h5>
                                        <h5 className="updatedby" data-updated-by={this.state.updated_by}>Updated By {this.state.updated_by}</h5>
                                    </>
                                )
                                : ""
                        }
                    </div>
                </td>
                <td>
                    <div className="td-column">
                        <h5 className="subdue">Next Spawn</h5>
                        <h5 data-next-spawn={this.state.next_spawn_timestamp}>{this.state.next_spawn}</h5>
                        <h5 className="updatedby">{this.rate}% Chance</h5>
                    </div>
                </td>
                <td>
                    <div className="countdown" data-countdown={this.props.boss.id}>
                        {
                            '--'
                        }
                    </div>
                </td>
            </tr>
        );
    }
    updateTimer = () => {
        if (this.state.timer) {
            window.clearInterval(this.state.timer);
        }
        let willReset = false;
        let newElement = document.getElementById(this.props.boss.id);
        let timerId = countdown(
        new Date(this.state.next_spawn), 
        (ts) => {
            let countdown = ts.toHTML();
            let timer = newElement.querySelector(`[data-countdown="${this.props.boss.id}"]`);
            if (ts.value > 0) {
                if (this.props.boss.is_interval_timer) {
                    timer.innerHTML = `SPAWNED!`;
                }
                else {
                    willReset = true;
                }
            }
            else {
            timer.innerHTML = countdown;
            }
        },
        countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS,
        3
        );
        if (willReset) {
            this.setState({
                server: 4,
                next_spawn: this.getNextSpawn(),
                next_spawn_timestamp: this.getNextSpawn(true),
                timer: timerId
            }, () => {
                console.log(`Boss ${this.props.boss.name} updated`);
                this.updateTimer();
                this.forceUpdate();
            });
        }
        else {
            this.setState({
                timer: timerId
            }, () => {
                console.log(`Boss ${this.props.boss.name} timer updated`);
                this.forceUpdate();
            });
        }
    }
    componentDidMount = () => {
        this.updateTimer();
        // create a modal that opens when the boss is clicked
        let newElement = document.getElementById(this.props.boss.id);
        if (this.is_interval_timer) {
            newElement.addEventListener("click", () => {
                console.log(`clicked ${this.props.boss.name}`);
                this.openModal();
            });
        }
    }
    openModal = () => {
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
        modalName.innerHTML = `Edit Timer for ${this.props.boss.name}`;
    
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
            //Get user info
            let uid = auth.currentUser.uid;
            let docRef = doc(db, "users", uid);
            let userObject = await getDoc(docRef);
            let updatedBy = userObject.data().username;
            let userServer = userObject.data().server;
            let canUpdateTimer = userObject.data().is_boss_manager;

            if(!canUpdateTimer){
                alert("You don't have permission to skip timers! Suck a wee wee 🍆");
            } else {
                let date = modalDate.value;
                let time = modalTime.value;
                let timestamp = new Date(`${date} ${time}`).getTime() / 1000;
                //turn the interval from hours into seconds
                let interval = this.interval * 60 * 60;
                let nextSpawn = timestamp + interval;
                this.updateDatabase({
                    last_killed: new Timestamp(timestamp, 0),
                    next_spawn: new Timestamp(nextSpawn, 0),
                    updated_by: updatedBy
                }, userServer);
                modal.classList.remove("show");
                modalContent.classList.remove("show");
            }
        });
    
        // set the modal skip button to skip the boss
        modal.querySelector("[data-modal-skip]").addEventListener("click", async () => {
            //Get user info
            let uid = auth.currentUser.uid;
            let docRef = doc(db, "users", uid);
            let userObject = await getDoc(docRef);
            let updatedBy = userObject.data().username;
            let userServer = userObject.data().server;
            let canUpdateTimer = userObject.data().is_boss_manager;

            if(!canUpdateTimer){
                alert("You don't have permission to skip timers! Suck a wee wee 🍆");
            } else {
                //Calculate next spawn
                let interval = this.interval * 60 * 60;
                let nextSpawn = this.next_spawn[userServer - 1].seconds + interval;
                //Update in database
                this.updateDatabase({
                    last_killed: this.last_killed[userServer - 1],
                    next_spawn: new Timestamp(nextSpawn, 0),
                    updated_by: updatedBy
                }, userServer);
    
                modal.classList.remove("show");
                modalContent.classList.remove("show");
            }
        });
    }
    updateDatabase = (data, server) => {        
        if (this.props.boss.is_server_boss) {
            this.props.boss.last_killed[server - 1] = data.last_killed;
            this.props.boss.next_spawn[server - 1] = data.next_spawn;
            this.props.boss.updated_by[server - 1] = data.updated_by;
        }
        else {
            this.props.boss.last_killed = data.last_killed;
            this.props.boss.next_spawn = data.next_spawn;
            this.props.boss.updated_by = data.updated_by;
        }
        let updatedData = {
          last_killed: this.props.boss.last_killed,
          next_spawn: this.props.boss.next_spawn,
          updated_by: this.props.boss.updated_by
        };
        // console.log(updatedData);
        // update the boss on the server
        let bossRef = doc(db, "bosses", this.props.boss.id);
        updateDoc(bossRef, updatedData);
    }
}

export default Boss;