import {FILTER_COUNTRY, FILTER_STARS, FILTER_TYPE} from "@/assets/js/JSONframework/filterTypes"

export default class jsonFramework {
    constructor({json}) {
        this.defaultData = json
        this.data = json
        this.countriesList = this.generateCountries()
        this.filter = [
            {type: FILTER_COUNTRY, val: []},
            {type: FILTER_STARS, val: []},
            {type: FILTER_TYPE, val: []},
        ]
        this.makeDefaultMinMax()
    }

    makeDefaultMinMax() {
        this.min = 0
        this.max = 0

        this.defaultData.map(item => {
            item.min_price > this.max ? this.max = item.min_price : item.min_price < this.min ? this.min = item.min : null
        })
    }

    generateCountries() {
        const countries = []

        this.data.map(item => {
            if (!countries.includes(item.country))
                countries.push(item.country)
        })

        return countries
    }

    get countries() {
        return this.countriesList
    }

    get minMaxPrice() {
        const min = this.min
        const max = this.max

        return {min, max}
    }

    filterData({type, value}) {
        const newFilter = []

        this.filter.map(item => {
            if (item.type === type)
                item.val = value
            newFilter.push(item)
        })

        this.filter = newFilter
        this.updateData()
    }

    updateData() {
        let newData = this.defaultData

        this.filter.map(item => {
            if (item.val.length !== 0) {
                newData = newData.filter(el => item.val.includes(el[item.type]))
            }
        })

        this.data = newData.filter(el => el.min_price >= this.min && el.min_price <= this.max)
    }

    filterPrice({min, max}) {
        this.min = min
        this.max = max
    }

    get Hotels() {
        return this.data
    }

    clearFilters() {
        this.filter = this.filter.map(item => {
            item.val = []
            return item
        })
        this.makeDefaultMinMax()
        this.updateData()
    }
}
