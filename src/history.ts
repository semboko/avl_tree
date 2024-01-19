import { cloneDeep } from 'lodash';

import { Tree } from './tree';

class TreeHistoryItem{
    description: string
    tree: Tree

    constructor(description: string, tree: Tree){
        this.description = description
        this.tree = tree
    }
}

export class TreeHistory{
    storage: Array<TreeHistoryItem>
    frame: number
    drawing_ctx: CanvasRenderingContext2D

    constructor(){
        const tree = new Tree()
        const init = new TreeHistoryItem("Initialized", tree)
        this.storage = []
        this.storage.push(init)
        this.frame = 0
        const canvas = document.getElementById("canvas") as HTMLCanvasElement
        this.drawing_ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    }

    get_current(): Tree {
        return this.storage[this.frame].tree
    }

    add_node(this: TreeHistory, value: number): void {
        const last = this.get_current()
        const next = cloneDeep(last) as Tree
        next.add_node(value)
        const item = new TreeHistoryItem("Add " + value, next)
        this.storage.push(item)
        this.frame = this.storage.length - 1
    }

    delete_node(this: TreeHistory, value: number): void {
        const last = this.get_current()
        const next = cloneDeep(last) as Tree
        next.delete(value)
        const item = new TreeHistoryItem("Delete " + value, next)
        this.storage.push(item)
        this.frame = this.storage.length - 1
    }

    back(this: TreeHistory): void {
        this.frame -= 1
        this.get_current().render(this.drawing_ctx)
        this.draw()
    }

    forward(this: TreeHistory): void {
        this.frame += 1
        this.get_current().render(this.drawing_ctx)
        this.draw()
    }

    draw(this: TreeHistory): void {
        const form = document.getElementById("history-form") as HTMLFormElement
        form.innerHTML = ""

        for (let i = 0; i < this.storage.length; i++) {
            const item = document.createElement("div") as HTMLDivElement
            const label = document.createElement("label") as HTMLLabelElement
            const input = document.createElement("input") as HTMLInputElement
            const p = document.createElement("span") as HTMLParagraphElement
            item.className = "mui-radio"
            input.type = "radio"
            input.name = "history_item"
            input.value = i.toString()
            p.innerText = this.storage[i].description
            if(i === this.frame){
                input.checked = true
            }
            label.appendChild(input)
            label.appendChild(p)
            item.appendChild(label)
            form.appendChild(item)

            input.addEventListener("change", () => {
                const i = Number(input.value)
                this.frame = i
                this.storage[i].tree.render(this.drawing_ctx)
            })
        }
    }
}