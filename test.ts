let canvas = document.getElementById("canvas") as HTMLCanvasElement
if (canvas !== null){
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    ctx.fillStyle = "red"
    ctx.fillRect(20, 20, 100, 100)
}
