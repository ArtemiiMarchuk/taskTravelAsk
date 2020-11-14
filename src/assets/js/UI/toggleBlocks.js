import * as $ from 'jquery'

export default class toggleBlocks {
    constructor({blocksSelector, activeClass}) {
        this.blocksSelector = blocksSelector
        this.blocks = $(blocksSelector)
        this.arrowSelector = '> span'
        this.contentSelector = '> div'
        this.textSelector = '> p'
        this.activeBlockClass = activeClass

        this.blocks.on('click', `${this.textSelector}, ${this.arrowSelector}`, this.clickHandler.bind(this))
    }

    clickHandler(event) {
        const clickedBlock = $(event.target).parent(this.blocksSelector)

        this.toggleContent(clickedBlock)
    }

    toggleContent(block) {
        const content = block.find(this.contentSelector)
        const show = content.css('display') === 'none'

        if (show) {
            content.show(300)
            block.addClass(this.activeBlockClass)
        } else {
            content.hide(300)
            block.removeClass(this.activeBlockClass)
        }

    }
}
