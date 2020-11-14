import * as $ from 'jquery'
import {FILTER_STARS} from "@/assets/js/JSONframework/filterTypes"

export default class checkboxesWrapper {
    constructor({wrapperSelector, onChange}) {
        this.checkboxesSelector = `${wrapperSelector} > input`
        this.checkboxes = $(this.checkboxesSelector)
        this.onChange = onChange
        this.checkedBoxes = []

        this.checkboxes.on('change', this.clickHandler.bind(this))
    }

    clickHandler() {
        this.checkedBoxes = []

        $(`${this.checkboxesSelector}:checked`).map((index, item) => {
            this.checkedBoxes.push(+item.value)
        })

        if (this.checkedBoxes.length > 1) {
            this.checkedBoxes = this.checkedBoxes.filter(el => el !== 0)
        }

        this.onChange({
            type: FILTER_STARS,
            value: this.checkedBoxes
        })
    }

    makeDefault() {
        this.checkboxes.prop('checked', false)
    }
}
