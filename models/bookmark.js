module.exports = 
class Bookmark{
    constructor(name,url,catgeroy)
    {
        this.Id = 0;
        this.Name = name !== undefined ? name : "";
        this.Url = url !== undefined ? url : "";
        this.Category = catgeroy !== undefined ? catgeroy : "";
    }
}