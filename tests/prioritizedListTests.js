const { expect } = require("chai")
const allcombinations = require('allcombinations');

module.exports = function(){

    describe('PrioritizedListTests', function(){

        let greater, list, comparisons

        this.beforeEach(async function(){
            comparisons = 0

            greater = async function(item1, item2){
                comparisons++
                if (item1 > item2) return item1;
                if (item2 > item1) return item2;
            }

            list = await this.CreateList(greater)
        

            this.checkOrder = async function (input, expectedOutput){
                for(let element of input) await list.add(element)
                expect(await list.toArray()).to.deep.equal(expectedOutput)
            }

            this.checkAllCombinations = async function (input){
                let combinations = allcombinations(input)
                for (let combination of combinations) {
                    list = await this.CreateList(greater)
                    await this.checkOrder(combination,input)
                }
            }
        })

        it('should be empty', async function(){
            expect(await list.toArray()).to.deep.equal([])
        })

        it('adding an item to the list', async function(){
            await list.add('B')
            expect(await list.toArray()).to.deep.equal(['B'])
        })

        it('adding a second item that is greater', async function(){
            await this.checkOrder(['1','2'],['2','1'])
        })

        it('adding a second item that is lower', async function(){
            await this.checkOrder(['2','1'],['2','1'])
        })

        it('checking lists of 3 elements', async function(){
            await this.checkAllCombinations(['3','2','1'])
        })

        it('checking lists of 4 elements', async function(){
            await this.checkAllCombinations(['4','3','2','1'])
        })

        it('checking lists of 5 elements', async function(){
            await this.checkAllCombinations(['5','4','3','2','1'])
        })

        it('checking lists of 5 elements should not make more than log(n) comparisons', async function(){
            let combinations = allcombinations(['5','4','3','2','1'])
            let maximumComparisons = 0
            for (let combination of combinations) {
                list = await this.CreateList(greater)
                maximumComparisons+=Math.ceil(Math.log2(5))+Math.ceil(Math.log2(4))+Math.ceil(Math.log2(3))+Math.ceil(Math.log2(2))
                await this.checkOrder(combination,['5','4','3','2','1'])
            }

            expect(comparisons).to.be.lessThan(maximumComparisons)
        })

        it('checking lists of 4 elements when middle ones are equal', async function(){
            await this.checkAllCombinations(['4','3','3','1'])
        })

        it('checking lists of 4 elements when greater ones are equal', async function(){
            await this.checkAllCombinations(['4','4','3','1'])
        })

        it('checking lists of 4 elements when smaller ones are equal', async function(){
            await this.checkAllCombinations(['4','3','1','1'])
        })
    })

}