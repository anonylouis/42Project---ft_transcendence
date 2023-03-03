import { useRef, useEffect } from 'react'
import { Bonus, Game, userPos } from '../interfaces/interfaceGame';
import { canvas_props, normalNet, Net, Player, normalPlayer, Ball, normalBall, bigBallRadius } from '../interfaces/interfaceCanvas';
import { Socket } from 'socket.io-client';
import { bonusTypeColor } from '../datas/gameModesOptions';

function drawRect(ctx : CanvasRenderingContext2D | null, x : number, y : number, w : number, h : number, color : string) {
	if (ctx != null)
	{
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);
	}
}

function drawCircle(ctx : CanvasRenderingContext2D | null, x : number, y : number, radius : number, color : string) {
	if (ctx != null) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, false);
		ctx.closePath();
		ctx.fill();
	}
}

function drawStar(ctx : CanvasRenderingContext2D | null, x : number, y : number, radius : number, n_spike : number, inset : number, color : string) {
	if (ctx != null) {
		ctx.save();
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.translate(x, y);
		ctx.moveTo(0,0-radius);
		for (var i = 0; i < n_spike; i++) {
			ctx.rotate(Math.PI / n_spike);
			ctx.lineTo(0, 0 - (radius * inset));
			ctx.rotate(Math.PI / n_spike);
			ctx.lineTo(0, 0 - radius);
		}
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
}

function drawText(ctx : CanvasRenderingContext2D | null, text: string, x : number, y : number, color : string)
{
	if (ctx != null) {
		ctx.fillStyle = color;
		ctx.font = "75px fantasy";
		ctx.fillText(text, x, y);
	}
}

function drawNet(ctx : CanvasRenderingContext2D | null, net : Net) {
	if (ctx != null) {
		for (let i = 0; i <= ctx.canvas.height; i += 15) {
			drawRect(ctx, net.x * ctx.canvas.width , i, net.width, net.height, net.color);
		}
	}
}

function render(ctx : CanvasRenderingContext2D | null, player1 : Player, player2 : Player, ball : Ball, bonus1 : Bonus | null, bonus2 : Bonus| null, bonusradius : number) {
	if (ctx != null)
	{
		//background
		drawRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, "black");
		//separation 
		drawNet(ctx, normalNet);
		//scores
		drawText(ctx, player1.score.toString(), (ctx.canvas.width / 4), (ctx.canvas.height / 5), "WHITE"); // a changer : width / 4 - tailledunchiffre/2
		drawText(ctx, player2.score.toString(), (3 * ctx.canvas.width / 4), (ctx.canvas.height / 5), "WHITE"); // same
		// players rect
		drawRect(ctx, 0, (player1.y - player1.height / 2) * ctx.canvas.height, player1.width * ctx.canvas.width, player1.height * ctx.canvas.height, player1.color);
		drawRect(ctx, (1 - player2.width) * ctx.canvas.width, (player2.y - player2.height / 2) * ctx.canvas.height, player2.width * ctx.canvas.width, player2.height * ctx.canvas.height, player2.color);
		//ball
		drawCircle(ctx, ball.x * ctx.canvas.width, ball.y * ctx.canvas.height, ball.radius * ctx.canvas.width, ball.color);

		//bonus
		if (bonus1 != null)
			drawStar(ctx, bonus1.x * ctx.canvas.width, bonus1.y * ctx.canvas.height, bonusradius * ctx.canvas.width * 0.8, 10, 2, bonusTypeColor[bonus1.type]);
		if (bonus2 != null)
			drawStar(ctx, bonus2.x * ctx.canvas.width, bonus2.y * ctx.canvas.height, bonusradius * ctx.canvas.width * 0.8, 10, 2, bonusTypeColor[bonus2.type]);
	}
}

const Canvas = (props : canvas_props) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)

	const socket : Socket = props.socket;
	const userId : string = props.userId;

	useEffect(() => {
		if (canvasRef.current != null) {
			const ctx : CanvasRenderingContext2D | null =  canvasRef.current.getContext('2d', { alpha: false });

			ctx?.canvas.addEventListener("mousemove", (evt) => {
				let rect = ctx.canvas.getBoundingClientRect();
				let new_pos = (evt.clientY - rect.top) / (rect.bottom - rect.top)
		
				let props : userPos = {userId:userId, pos:new_pos}
				socket.emit('updatePos', props);
			}); 
		}
	}, [])

	socket.on('renderGame', (data:Game) => {
		let player1 : Player = {y:data.p1, width : data.playerWidth, height:data.p1Height , color:data.p1Color, score:data.score1};
		let player2 : Player = {y:data.p2, width : data.playerWidth, height:data.p2Height, color:data.p2Color, score:data.score2};
		let ball : Ball = {x:data.ballX, y:data.ballY, radius:normalBall.radius, speed:data.speed, Vx:data.Vx, Vy:data.Vy, color:data.ballColor};

		if (data.big) {
			ball.radius = bigBallRadius;
		}

		if (canvasRef.current != null) {
			render(canvasRef.current.getContext('2d', { alpha: false }), player1, player2, ball, data.bonus1, data.bonus2, data.bonusRadius);
		}

	});

	const param = {className:props.className, width:props.width, height:props.height};
	return <canvas ref={canvasRef} {...param} />
}

export default Canvas