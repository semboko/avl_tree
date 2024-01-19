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
    height: number = 1

    constructor(value: number) {
        this.value = value
    }

    getX(this: TreeNode, canvas: HTMLCanvasElement): number {
        if (this.parent === null){
            this.pos.v = 0
        } else {
            if (this === this.parent.left){
                this.pos.v = this.parent.pos.v * 2
            } else {
                this.pos.v = this.parent.pos.v * 2 + 1
            }
        }
        const box_width = canvas.width / (2 ** this.pos.h)
        return box_width * this.pos.v + box_width / 2
    }

    left_height(this: TreeNode): number {
        return this.left === null ? 0 : this.left.height
    }

    right_height(this: TreeNode): number {
        return this.right === null ? 0 : this.right.height
    }

    getMaxHeight(this: TreeNode): number {
        return Math.max(this.left_height(), this.right_height())
    }

    balance(this: TreeNode): number {
        return this.left_height() - this.right_height()
    }

    render(this: TreeNode, ctx: CanvasRenderingContext2D,x: number, y: number, radius: number) {
        ctx.beginPath()
        ctx.ellipse(x, y, radius, radius, 0, 0, 360)
        ctx.stroke()
        ctx.fillStyle = "#FFFFFF"
        ctx.fill()
        ctx.font = radius + "px Arial"
        ctx.fillStyle = "#333333"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(this.value.toString(), x, y)
        
        ctx.font = radius/2 + "px Arial"
        const rx = x + radius * .8
        const ry = y - radius * .8
        const rs = radius/2

        ctx.rect(rx, ry, rs, rs)
        ctx.stroke()

        ctx.fillStyle = "#333333"
        ctx.fillText(this.height.toString(), rx + rs/2, ry + rs/2)
    }
}


export class Tree {
    root: TreeNode | null = null

    draw: DrawParams = new DrawParams()

    protected left_rotate(this: Tree, x: TreeNode): void {
        const y = x.right
        x.right = y.left
        if (y.left !== null){
            y.left.parent = x
        }
        y.parent = x.parent
        if (x.parent === null){
            this.root = y
        } else if (x === x.parent.left){
            x.parent.left = y
        } else {
            x.parent.right = y
        }
        y.left = x
        x.parent = y

        x.height = x.getMaxHeight() + 1
        y.height = y.getMaxHeight() + 1
    }

    protected right_rotate(this: Tree, y: TreeNode): void {
        const x = y.left
        y.left = x.right
        if (x.right !== null){
            x.right.parent = y
        }
        x.parent = y.parent
        if (y.parent == null){
            this.root = x
        } else if (y == y.parent.right){
            y.parent.right = x
        } else {
            y.parent.left = x
        }
        x.right = y
        y.parent = x

        y.height = y.getMaxHeight() + 1
        x.height = x.getMaxHeight() + 1
    }

    node_fixup(this: Tree, node: TreeNode): void {
        let x = node
        while (x !== null){
            x.height = x.getMaxHeight() + 1

            const balance = x.balance()
            
            if (balance > 1){
                const left_balance = x.left.balance()
                if (left_balance < 0) {
                    this.left_rotate(x.left)
                }
                this.right_rotate(x)
            }

            else if (balance < -1){
                const right_balance = x.right.balance()
                if (right_balance > 0) {
                    this.right_rotate(x.right)
                }
                this.left_rotate(x)
            }

            x = x.parent
        }
    }
    
    add_node(this: Tree, value: number): void {
        if (this.search(value) !== null){
            return
        }
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

        this.node_fixup(new_node)
    }

    transplant(this: Tree, u: TreeNode, v: TreeNode): void {
        if(u.parent === null){
            this.root = v
        } else if (u === u.parent.left){
            u.parent.left = v
        } else {
            u.parent.right = v
        }
        if(v !== null){
            v.parent = u.parent
        }
    }

    delete(this: Tree, value: number): void {
        const node = this.search(value)
        if(node === null){
            return
        }
        if(node.right === null){
            this.transplant(node, node.left)
            this.node_fixup(node.left)
        }
        else if(node.left === null){
            this.transplant(node, node.right)
            this.node_fixup(node.right)
        }
        else {
            const y = this.tree_minimum(node.right)
            const z = y !== null ? y.right : y
            if(y.parent !== node){
                this.transplant(y, y.right)
                y.right = node.right
                y.right.parent = node
            }
            this.transplant(node, y)
            y.left = node.left
            y.left.parent = node
            this.node_fixup(z)
        }
        
    }

    tree_minimum(this: Tree, root: TreeNode): TreeNode{
        let min = root
        while (min.left !== null){
            min = min.left
        }
        return min
    }

    search(this: Tree, value: number): TreeNode | null {
        let x = this.root

        while (x !== null){
            if(x.value === value){
                return x
            }
            if(x.value >= value){
                x = x.left
            } else{
                x = x.right
            }
        }

        return null
    }

    scale(this: Tree, canvasX: number, canvasY: number, z: number): void {
        if (z < 0){
            this.draw.scale -= .1
        } else {
            this.draw.scale += .1
        }
    }

    render(this: Tree, ctx: CanvasRenderingContext2D){
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        if (this.root === null){
            return
        }
        
        const queue: TreeNode[] = [this.root]
        const height = this.root.height
        this.root.pos.v = 0

        while (queue.length > 0){
            const node: TreeNode = queue.pop() as TreeNode
            const node_radius = this.draw.node_radius * this.draw.scale
            node.pos.h = height - node.height
            const y = node_radius + node.pos.h * node_radius * 2
            const x = node.getX(ctx.canvas)

            if (node.parent !== null) {
                const py = node.parent.pos.h * node_radius + node_radius
                const px = node.parent.getX(ctx.canvas)

                const alpha = Math.atan2(x - px, y - py)
                const dx = Math.sin(alpha) * node_radius
                const dy = Math.cos(alpha) * node_radius
                ctx.beginPath()
                ctx.moveTo(px + dx, py + dy)
                ctx.lineTo(x, y)
                ctx.stroke()
            }
            
            node.render(ctx, x, y, node_radius)

            if(node.left !== null){
                queue.push(node.left)
            }
            if(node.right !== null){
                queue.push(node.right)
            }
        }
    }
}