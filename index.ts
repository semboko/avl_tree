class NodePosition{
    h: number
    v: number

    constructor(h: number, v: number){
        this.h = h
        this.v = v
    }
}

class DrawParams{
    node_radius: number = 25
    scale: number = 1
    shift_x: number = 0
    shift_y: number = 0
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

    getX(this: TreeNode, canvas: HTMLCanvasElement): number {
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

    draw: DrawParams = new DrawParams()

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
            const node: TreeNode = queue.pop() as TreeNode
            const y = this.draw.node_radius + node.pos.h * this.draw.node_radius * 2
            const x = node.getX(ctx.canvas)

            if (node.parent !== null) {
                const py = y - this.draw.node_radius * 2
                const px = node.parent.getX(ctx.canvas)

                const alpha = Math.atan2(x - px, y - py)
                const dx = Math.sin(alpha) * this.draw.node_radius
                const dy = Math.cos(alpha) * this.draw.node_radius
                ctx.beginPath()
                ctx.moveTo(px + dx, py + dy)
                ctx.lineTo(x, y)
                ctx.stroke()
            }
            
            node.render(ctx, x, y, this.draw.node_radius)

            if(node.left !== null){
                queue.push(node.left)
            }
            if(node.right !== null){
                queue.push(node.right)
            }
        }
    }
}

window.onload = () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

    const tree = new Tree()

    for (let i = 0; i < 20; i++) {
        const value = Math.round(Math.random() * 100)
        tree.add_node(value)
    }
    tree.render(ctx)

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

    canvas.addEventListener("click", (event) => {
        console.log(event)
    })
}
