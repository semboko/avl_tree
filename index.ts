const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

class TreeNode {
    value: number
    left: TreeNode | null = null
    right: TreeNode | null = null
    parent: TreeNode | null = null

    constructor(value: number) {
        this.value = value
    }

    render(this: TreeNode, ctx: CanvasRenderingContext2D,x: number, y: number) {
        ctx.beginPath()
        ctx.ellipse(x, y, 25, 25, 0, 0, 360)
        ctx.stroke()
        ctx.font = "25px Arial";
        ctx.fillStyle = "#333333"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(this.value.toString(), x, y)
    }
}


class Tree {
    root: TreeNode | null = null

    add_node(this: Tree, value: number): void {
        const new_node = new TreeNode(value)
        let x: TreeNode | null = this.root
        let y: TreeNode | null = null
        while (x !== null){
            y = x
            if (x.value >= value){
                x = x.left
            } else {
                x = x.right
            }
        }
        new_node.parent = y
        if (y === null){
            this.root = new_node
            return
        }
        if (y.value < new_node.value){
            y.right = new_node
        } else {
            y.left = new_node
        }
    }

    render(this: Tree, ctx: CanvasRenderingContext2D){
        if (this.root === null){
            return
        }
        this.root.render(ctx, 100, 100)
    }
}

const tree = new Tree()

const insert_button = document.getElementById("insert_button") as HTMLButtonElement
insert_button.onclick = () => {
    const insert_input = document.getElementById("insert_value") as HTMLInputElement
    const insert_value = Number(insert_input.value)
    if (isNaN(insert_value)){
        insert_input.value = ""
        return
    }
    tree.add_node(insert_value)
    insert_input.value = ""
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    tree.render(ctx)
}