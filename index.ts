const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D


class NodePosition{
    h: number
    v: number

    constructor(h: number, v: number){
        this.h = h
        this.v = v
    }
}


class TreeNode {
    value: number
    pos: NodePosition
    left: TreeNode | null = null
    right: TreeNode | null = null
    parent: TreeNode | null = null

    constructor(value: number) {
        this.value = value
    }

    getX(this: TreeNode): number {
        const box_width = canvas.width / (2 ** this.pos.h)
        return box_width * this.pos.v + box_width / 2
    }

    render(this: TreeNode, ctx: CanvasRenderingContext2D,x: number, y: number, radius: number) {
        ctx.beginPath()
        ctx.ellipse(x, y, radius, radius, 0, 0, 360)
        ctx.stroke()
        ctx.fillStyle = "#FFFFFF"
        ctx.fill()
        ctx.font = "25px Arial";
        ctx.fillStyle = "#333333"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(this.value.toString(), x, y)
    }
}


class Tree {
    root: TreeNode | null = null

    node_radius: number = 25

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
            this.root.pos = new NodePosition(0, 0)
            return
        }
        if (y.value < new_node.value){
            y.right = new_node
            new_node.pos = new NodePosition(y.pos.h + 1, y.pos.v * 2 + 1)
        } else {
            y.left = new_node
            new_node.pos = new NodePosition(y.pos.h + 1, y.pos.v * 2)
        }
    }

    render(this: Tree, ctx: CanvasRenderingContext2D){
        if (this.root === null){
            return
        }
        
        const queue: TreeNode[] = [this.root]

        while (queue.length > 0){
            const node: TreeNode = queue.pop()
            const y = 25 + node.pos.h * 50
            const x = node.getX()

            if (node.parent !== null) {
                const py = y - 50
                const px = node.parent.getX()

                const alpha = Math.atan2(x - px, y - py)
                const dx = Math.sin(alpha) * 25
                const dy = Math.cos(alpha) * 25
                ctx.beginPath()
                ctx.moveTo(px + dx, py + dy)
                ctx.lineTo(x, y)
                ctx.stroke()
            }
            
            node.render(ctx, x, y, this.node_radius)

            if(node.left !== null){
                queue.push(node.left)
            }
            if(node.right !== null){
                queue.push(node.right)
            }
        }
    }
}

const tree = new Tree()

const insert_button = document.getElementById("insert_button") as HTMLButtonElement
insert_button.onclick = () => {
    const insert_input = document.getElementById("insert_value") as HTMLInputElement
    
    if (insert_input.value === ""){
        return
    }
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