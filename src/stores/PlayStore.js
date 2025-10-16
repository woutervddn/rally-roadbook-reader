import { reactive } from 'vue';
const {openDB} = idb;

export const PlayStore = reactive({
  pause: true,
  reverse: false,
  routes: [],
  route: [],
  routeTitle: '',
  highlightPrevWP: false,
  highlightPrevWPTimer: null,
  activeWP: 0,
  totalWPs: 0,
  totalDriven: 0,
  wpDriven:0,
  conn: null,
  activeEventListener: false,
  activeEventListenerfunc: null,
  toggle() {
    this.pause = !this.pause;
  },
  toggleReverse(){
    this.reverse = !this.reverse;
  },
  incrementWP(){
    this.activeWP++
    this.activateHighlight();
  },
  decrementWP(){
    this.activeWP--
  },
  activateRoute(route){
    if(this.routeTitle != route.name ){
      // Selected a route that is not the current one, reset all things
      this.routeTitle = route.name;
      this.route = route.route;
      this.totalWPs = this.route.wpt.length;
      this.activeWP = 0;
      this.totalDriven = 0;
      this.wpDriven = 10;
    }
  },
  activateHighlight(){
    this.disableHighlight();
    console.log('activated Highlight');
    this.highlightPrevWP = true;
    this.highlightPrevWPTimer = window.setTimeout(this.disableHighlight.bind(this), 3000);
  },
  disableHighlight(){
    this.highlightPrevWP = false;
    if(this.highlightPrevWPTimer!= null) {
      console.log('disabled Highlight');
      window.clearTimeout(this.highlightPrevWPTimer);
    }
  },
  addRoute(routeTitle, route){
    console.log('addRoute', routeTitle, route)
    this.route = route;
    this.routeTitle = routeTitle;
    this.totalWPs = route.wpt.length;
    this.addRouteToDB({'name': routeTitle, 'route': route});
  },
  async addNote(routeTitle,note){
    console.log('addNote', routeTitle, note)
    //const db = await this.getDB();
    const rows = await this.getRoutesFromDB();
    routeTitle = (routeTitle ?? "").trim();
    if(rows.some(row => row.name === routeTitle)){
      let theIndex = rows.findIndex( row => row.name === routeTitle );
      let theRoute = rows[theIndex];
      if(!theRoute.hasOwnProperty('notes')){
        theRoute.notes = [];
      }
      theRoute.notes.push(note);
      await this.putRouteToDB(theRoute);
      this.refreshItems();
    }

    //this.totalWPs = route.wpt.length;
    //this.addRouteToDB({'name': routeTitle, 'route': route});
  },

  async getDB() {
    if (!this.conn) this.conn =  openDB("route-db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("routes")) {
          db.createObjectStore("routes", { keyPath: "id", autoIncrement: true });
        }
      }
    });
    return this.conn;
  },
  async addRouteToDB(route) {
    const db = await this.getDB();
    const rows = await this.getRoutesFromDB();
    route.name = (route.name ?? "").trim();
    if(rows.some(row => row.name === route.name)) return;
    db.add("routes", route);
    console.log(`Added #${rows.length + 1} (${route.id})`, route);
    this.refreshItems();
  },
  async getRoutesFromDB() {
    const db = await this.getDB();
    return db.getAll("routes");
  },
  async  putRouteToDB(route) {
    const db = await this.getDB();
    return db.put("routes", route);
  },
  async removeRouteFromDB(id) {
    const db = await this.getDB();
    return db.delete("routes", id);
  },
  async clearItems() {
    const db = await this.getDB();
    return db.clear("routes");
  },
  async refreshItems (){
    this.routes = await this.getRoutesFromDB();
  }
})
