import SpaService from "./spa-service.js";

let _spaService = new SpaService("catergories");


// Gør det muligt for HTML DOM'en at læse funktionen pageChange
window.pageChange = function () {
    _spaService.pageChange();
}