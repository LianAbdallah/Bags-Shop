class BaseModel {
    constructor(schema) {
        this.modelSchema = schema;
    }

    async create(modelData){
        const model = new this.modelSchema(modelData);
        await model.save();
        return model;
    }

    async getAll(){
        return this.modelSchema.find();
    }

 

    async update(id, modelData) {
        return this.modelSchema.findByIdAndUpdate(id, modelData);
    }

    async delete(id) {
        return this.modelSchema.findByIdAndDelete(id);
    }

    async where(key, value){
        return this.modelSchema.find({[key]: value}).exec();
    }

    async whereMore(obj){
        return this.modelSchema.find(obj).exec();
    }

    // التعريف الصحيح الوحيد لـ findOne
    async findOne(filter) {
        return this.modelSchema.findOne(filter).exec();
    }
}

module.exports = BaseModel;
