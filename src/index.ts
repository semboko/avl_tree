import { TreeHistory } from './history';

window.onload = () => {
    const history = new TreeHistory()
    
    history.get_current().render(history.drawing_ctx)
    history.draw()

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
        history.add_node(insert_value)
        insert_input.value = ""
        history.get_current().render(history.drawing_ctx)
        history.draw()
    }

    // canvas.addEventListener("wheel", (event: WheelEvent) => {
    //     const canvas_rect = canvas.getBoundingClientRect()
    //     const cx = canvas_rect.left
    //     const cy = canvas_rect.top
    //     tree.scale(event.x - cx, event.y - cy, event.deltaY)
    //     tree.render(ctx)
    // })


    const delete_button = document.getElementById("delete_button") as HTMLButtonElement
    delete_button.onclick = () => {
        const insert_input = document.getElementById("insert_value") as HTMLInputElement
        
        if (insert_input.value === ""){
            return
        }
        const insert_value = Number(insert_input.value)
        if (isNaN(insert_value)){
            insert_input.value = ""
            return
        }
        history.delete_node(insert_value)
        insert_input.value = ""
        history.get_current().render(history.drawing_ctx)
        history.draw()
    }

    const back_btn = document.getElementById("back_btn") as HTMLButtonElement
    const forward_btn = document.getElementById("forward_btn") as HTMLButtonElement

    back_btn.onclick = () => history.back()
    forward_btn.onclick = () => history.forward()

}
