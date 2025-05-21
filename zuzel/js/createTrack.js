const canvas = document.getElementById('mainCanvas');
export default function () {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.moveTo(0, 0);
    ctx.lineTo(1000, 0);
    ctx.lineTo(1000, 400);
    ctx.lineTo(0, 400);
    ctx.closePath();
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.moveTo(200, 1);
    ctx.lineTo(800, 1);
    ctx.arc(799, 200, 199, 1.5 * Math.PI, 2.5 * Math.PI);
    ctx.lineTo(200, 399);
    ctx.arc(201, 200, 199, 0.5 * Math.PI, 1.5 * Math.PI);
    ctx.fillStyle = "#8B5D33";
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.moveTo(250, 150);
    ctx.lineTo(750, 150);
    ctx.arc(750, 200, 50, 1.5 * Math.PI, 2.5 * Math.PI);
    ctx.lineTo(250, 250);
    ctx.arc(250, 200, 50, 0.5 * Math.PI, 1.5 * Math.PI);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.moveTo(492, 250);
    ctx.lineTo(492, 400);
    ctx.lineTo(510, 400);
    ctx.lineTo(510, 250);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.moveTo(510, 250 + i * 20);
        ctx.lineTo(502, 250 + i * 20);
        ctx.lineTo(502, 258 + i * 20);
        ctx.lineTo(510, 258 + i * 20);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
    }
    for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.moveTo(500, 260 + i * 20);
        ctx.lineTo(492, 260 + i * 20);
        ctx.lineTo(492, 268 + i * 20);
        ctx.lineTo(500, 268 + i * 20);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
    }
}