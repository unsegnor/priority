const { expect } = require("chai")
const Priority = require("../index.js")
const allcombinations = require('allcombinations');

describe('PrioritizedList', function(){

    var greater, list, comparisons

    this.beforeEach(async function(){
        comparisons = 0

        greater = async function(item1, item2){
            comparisons++
            if (item1 > item2) return item1;
            if (item2 > item1) return item2;
            return;
        }

        list = await Priority.createPrioritizedList(greater)
    })

    async function checkOrder(input, expectedOutput){
        for(var element of input) await list.add(element)
        expect(list.toArray()).to.deep.equal(expectedOutput)
    }

    async function checkAllCombinations(input){
        var combinations = allcombinations(input)
        for (var combination of combinations) {
            list = await Priority.createPrioritizedList(greater)
            await checkOrder(combination,input)
        }
    }
    it('should be empty', async function(){
        expect(list.toArray()).to.deep.equal([])
    })

    it('adding an item to the list', async function(){
        list.add('B')
        expect(list.toArray()).to.deep.equal(['B'])
    })

    it('adding a second item that is greater', async function(){
        await checkOrder([1,2],[2,1])
    })

    it('adding a second item that is lower', async function(){
        await checkOrder([2,1],[2,1])
    })

    it('checking lists of 3 elements', async function(){
        await checkAllCombinations([3,2,1])
    })

    it('checking lists of 4 elements', async function(){
        await checkAllCombinations([4,3,2,1])
    })

    it('checking lists of 5 elements', async function(){
        await checkAllCombinations([5,4,3,2,1])
    })

    it('checking lists of 5 elements should not make more than log(n) comparisons', async function(){
        var combinations = allcombinations([5,4,3,2,1])
        var maximumComparisons = 0
        for (var combination of combinations) {
            list = await Priority.createPrioritizedList(greater)
            maximumComparisons+=Math.ceil(Math.log2(5))+Math.ceil(Math.log2(4))+Math.ceil(Math.log2(3))+Math.ceil(Math.log2(2))
            await checkOrder(combination,[5,4,3,2,1])
        }

        expect(comparisons).to.be.lessThan(maximumComparisons)
    })

    it('checking lists of 4 elements when middle ones are equal', async function(){
        await checkAllCombinations([4,3,3,1])
    })

    it('checking lists of 4 elements when greater ones are equal', async function(){
        await checkAllCombinations([4,4,3,1])
    })

    it('checking lists of 4 elements when smaller ones are equal', async function(){
        await checkAllCombinations([4,3,1,1])
    })
})