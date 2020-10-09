const Repository = require('../models/Repository');
var BookmarksData = require('../data/bookmarks.json');
const Validator = require('../models/validator');

module.exports = 
class BookmarksController extends require('./Controller'){
    constructor(req, res){
        super(req, res);
        this.bookmarksRepository = new Repository('Bookmarks');
        this.validateur = new Validator();
    }

    get(id){
        if(!isNaN(id))
            this.response.JSON(this.bookmarksRepository.get(id));
        else
            this.response.JSON(this.bookmarksRepository.getAll());
    }
    post(bookmark){  
        let newBookmark = this.bookmarksRepository.add(bookmark);
        if (bookmarksValidator.test(newBookmark) == true)
            this.response.created(newBookmark);
        else
            this.response.internalError();
    }
    put(bookmark){
 
        if (this.bookmarksRepository.update(bookmark))
            this.response.ok();
        else 
            this.response.notFound();
    }

    remove(id){
        if (this.bookmarksRepository.remove(id))
            this.response.accepted();
        else
            this.response.notFound();
    }

    queryStringParamsList() {
        // expose all the possible query strings
        let content = "<div style=font-family:arial>";
        content += "<h4>List of possible parameters in query strings:</h4>";
        content += "<h4>? sort = name <br>return {\"sort\":\"name\"} </h4>";
        content += "<h4>? sort = category <br>return {\"sort\":\"category\"} </h4>";
        content += "<h4>? name = string <br>return {\"name\":\"string\"} </h4>";
        content += "<h4>? category = string <br>return {\"category\":\"string\"} </h4>";
        content += "</div>"
        return content;
    }
    queryStringHelp() {
        
        this.res.writeHead(200, {'content-type':'text/html'});
        this.res.end(this.queryStringParamsList());
    }
    
    get(){
        let params = this.getQueryStringParams();
        // if we have no parameter, expose the list of possible query strings
        if (params === null) {
            this.response.JSON(this.bookmarksRepository.getAll());
        }
      
        else {
            if (this.checkParams(params)) {
                //this.doOperation(params);
            }
        }
    }
    checkParams(params){
        if ('sort' in params) {
            switch (params.sort){
                case ' ': // add operation
                case "name": // sort name   
                BookmarksData.sort((a, b) => a.Name.localeCompare(b.Name));
                    break;
                case "category": // sort category
                BookmarksData.sort((a, b) => a.Category.localeCompare(b.Category));
                    break;
                default:
                    return this.error(params, "unknown operation");
            }
        } else {
            return this.queryStringHelp();
        }
        // all parameters are ok
        this.response.JSON(BookmarksData);
    }
   
    error(params, message){
        params["error"] = message;
        this.response.JSON(params);
        return false;
    }

    result(params, value){
        if (value === Infinity) value = "Infinity";
        if (isNaN(value)) value = "NaN";
        params["value"] = value;
        this.response.JSON(params);
    }
}