
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";

export class Path {
	N(amount) { this.endpoint = `v ${-amount} ` }
	S(amount) { this.endpoint = `v ${amount} ` }
	E(amount) { this.endpoint = `h ${amount} ` }
	W(amount) { this.endpoint = `h ${-amount} ` }
	NE(amount) { this.endpoint = `l ${amount}, ${amount} ` }
	SE(amount) { this.endpoint = `l ${amount}, ${amount} ` }
	SW(amount) { this.endpoint = `l ${amount}, ${amount} ` }
	NW(amount) { this.endpoint = `l ${amount}, ${amount} ` }

	constructor(terminal, name) {
		this.d = ""
		this.endpoint = ""
	}
}

function closestPoint(pathNode, point) { // https://gist.github.com/mbostock/8027637#file-index-html-L69
	var pathLength = pathNode.getTotalLength(), precision = 8, best, bestLength, bestDistance = Infinity;
	for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) { // linear scan for coarse approximation
		if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
			best = scan, bestLength = scanLength, bestDistance = scanDistance; } }
	precision /= 2; // binary search for precise estimate
	while (precision > 0.5) {
		var before, after, beforeLength, afterLength, beforeDistance, afterDistance;
		if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
			best = before, bestLength = beforeLength, bestDistance = beforeDistance; } 
		else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
			best = after, bestLength = afterLength, bestDistance = afterDistance; } 
		else { precision /= 2; } }
	best = [best.x, best.y];
	best.distance = Math.sqrt(bestDistance);
	return best;
	function distance2(p) {
		var dx = p.x - point[0],
			dy = p.y - point[1];
		return dx * dx + dy * dy; } }
/*****************************************************************************
*                                                                            *
*  SVG Path Rounding Function                                                *
*  Copyright (C) 2014 Yona Appletree                                         *
*                                                                            *
*  Licensed under the Apache License, Version 2.0 (the "License");           *
*  you may not use this file except in compliance with the License.          *
*  You may obtain a copy of the License at                                   *
*                                                                            *
*      http://www.apache.org/licenses/LICENSE-2.0                            *
*                                                                            *
*  Unless required by applicable law or agreed to in writing, software       *
*  distributed under the License is distributed on an "AS IS" BASIS,         *
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
*  See the License for the specific language governing permissions and       *
*  limitations under the License.                                            *
*                                                                            *
*****************************************************************************/

/**
 * SVG Path rounding function. Takes an input path string and outputs a path
 * string where all line-line corners have been rounded. Only supports absolute
 * commands at the moment.
 * 
 * @param pathString The SVG input path
 * @param radius The amount to round the corners, either a value in the SVG 
 *               coordinate space, or, if useFractionalRadius is true, a value
 *               from 0 to 1.
 * @param useFractionalRadius If true, the curve radius is expressed as a
 *               fraction of the distance between the point being curved and
 *               the previous and next points.
 * @returns A new SVG path string with the rounding
 */
export function PathRounder(pathString, radius, useFractionalRadius) { // https://plnkr.co/edit/kGnGGyoOCKil02k04snu?preview
	function moveTowardsLength(movingPoint, targetPoint, amount) {
		var width = (targetPoint.x - movingPoint.x);
		var height = (targetPoint.y - movingPoint.y);
		var distance = Math.sqrt(width * width + height * height);
		return moveTowardsFractional(movingPoint, targetPoint, Math.min(1, amount / distance));
	}
	function moveTowardsFractional(movingPoint, targetPoint, fraction) {
		return {
			x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
			y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction
		};
	}
	function adjustCommand(cmd, newPoint) { // Adjusts the ending position of a command
		if (cmd.length > 2) {
			cmd[cmd.length - 2] = newPoint.x;
			cmd[cmd.length - 1] = newPoint.y;
		}
	}
	function pointForCommand(cmd) { // Gives an {x, y} object for a command's ending position
		return {
			x: parseFloat(cmd[cmd.length - 2]),
			y: parseFloat(cmd[cmd.length - 1]),
		};
	}
	var pathParts = pathString // Split apart the path, handing concatonated letters and numbers
		.split(/[,\s]/)
		.reduce(function (parts, part) {
			var match = part.match("([a-zA-Z])(.+)");
			if (match) {
				parts.push(match[1]);
				parts.push(match[2]);
			}
			else { parts.push(part); }
			return parts;
		}, [])
	var commands = pathParts.reduce(function (commands, part) { // Group the commands with their arguments for easier handling
		if (parseFloat(part) == part && commands.length) { commands[commands.length - 1].push(part); }
		else { commands.push([part]); }
		return commands;
	}, []);
	var resultCommands = []; // The resulting commands, also grouped
	if (commands.length > 1) {
		var startPoint = pointForCommand(commands[0]);
		var virtualCloseLine = null; // Handle the close path case with a "virtual" closing line
		if (commands[commands.length - 1][0] == "Z" && commands[0].length > 2) {
			virtualCloseLine = ["L", startPoint.x, startPoint.y];
			commands[commands.length - 1] = virtualCloseLine;
		}
		resultCommands.push(commands[0]); // We always use the first command (but it may be mutated)
		for (var cmdIndex = 1; cmdIndex < commands.length; cmdIndex++) {
			var prevCmd = resultCommands[resultCommands.length - 1];
			var curCmd = commands[cmdIndex];
			var nextCmd = (curCmd == virtualCloseLine) ? commands[1] : commands[cmdIndex + 1]; // Handle closing case
			if (nextCmd && prevCmd && (prevCmd.length > 2) && curCmd[0] == "L" && nextCmd.length > 2 && nextCmd[0] == "L") { // Nasty logic to decide if this path is a candidite.
				var prevPoint = pointForCommand(prevCmd); // Calc the points we're dealing with
				var curPoint = pointForCommand(curCmd);
				var nextPoint = pointForCommand(nextCmd);
				var curveStart, curveEnd; // The start and end of the cuve are just our point moved towards the previous and next points, respectivly
				if (useFractionalRadius) {
					curveStart = moveTowardsFractional(curPoint, prevCmd.origPoint || prevPoint, radius);
					curveEnd = moveTowardsFractional(curPoint, nextCmd.origPoint || nextPoint, radius);
				}
				else {
					curveStart = moveTowardsLength(curPoint, prevPoint, radius);
					curveEnd = moveTowardsLength(curPoint, nextPoint, radius);
				}
				adjustCommand(curCmd, curveStart); // Adjust the current command and add it
				curCmd.origPoint = curPoint;
				resultCommands.push(curCmd);
				var startControl = moveTowardsFractional(curveStart, curPoint, .5); // The curve control points are halfway between the start/end of the curve and the original point
				var endControl = moveTowardsFractional(curPoint, curveEnd, .5);
				var curveCmd = ["C", startControl.x, startControl.y, endControl.x, endControl.y, curveEnd.x, curveEnd.y]; // Create the curve 
				curveCmd.origPoint = curPoint; // Save the original point for fractional calculations
				resultCommands.push(curveCmd);
			}
			else { resultCommands.push(curCmd); } /* Pass through commands that don't qualify */
		}
		if (virtualCloseLine) { // Fix up the starting point and restore the close path if the path was orignally closed
			var newStartPoint = pointForCommand(resultCommands[resultCommands.length - 1]);
			resultCommands.push(["Z"]);
			adjustCommand(resultCommands[0], newStartPoint);
		}
	}
	else { resultCommands = commands; }
	return resultCommands.reduce(function (str, c) { return str + c.join(" ") + " "; }, "");
}
