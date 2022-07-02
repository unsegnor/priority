const {expect} = require('chai')
const Thing = require('./Thing')

describe('Thing', function(){
    it('must do stuff', async function(){
        let thing = Thing()
        let result = await thing.doStuff()
        expect(result).to.equal('stuff done')
    })
})