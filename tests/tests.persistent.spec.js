const Priority = require("../index.js")
const prioritizedListTests = require("./prioritizedListTests.js")
const {TestRepository} = require('persistent-programming')
const { expect } = require("chai")
const listName = "test-list"

describe('PersistentPrioritizedList', function(){
    beforeEach(async function(){
        this.CreateList = async function(greater){
            return Priority.getPersistentPrioritizedList(greater, listName, TestRepository())
        }
    })

    prioritizedListTests()

    it('recovering the list by name', async function(){
        let greater = async function(item1, item2){
            if (item1 > item2) return item1;
            if (item2 > item1) return item2;
        }

        let repository = TestRepository()

        let list = await Priority.getPersistentPrioritizedList(greater, listName, repository)

        await list.add('1')
        await list.add('2')
        await list.add('3')

        let recoveredList = await Priority.getPersistentPrioritizedList(greater, listName, repository)
        let array = await recoveredList.toArray()
        expect(array).to.deep.equal(['3','2','1'])
    })

    it('a list with a different name should be different', async function(){
        greater = async function(item1, item2){
            if (item1 > item2) return item1;
            if (item2 > item1) return item2;
        }

        let repository = TestRepository()

        let list = await Priority.getPersistentPrioritizedList(greater, listName, repository)

        await list.add('1')
        await list.add('2')
        await list.add('3')

        let recoveredList = await Priority.getPersistentPrioritizedList(greater, "differentName", repository)
        let array = await recoveredList.toArray()
        expect(array).to.deep.equal([])
    })
})
