const points = [ [5, 10], [10, 40], [40, 30], [60, 5], [90, 45], [120, 10], [150, 45], [200, 10] ] //https://codepen.io/francoisromain/pen/QMbMwp
  // Render the svg <path> element 
  // I:  - points (array): points coordinates
  //     - command (function)
  //       I:  - point (array) [x,y]: current point coordinates
  //           - i (integer): index of 'point' in the array 'a'
  //           - a (array): complete array of points coordinates
  //       O:  - (string) a svg path command
  // O:  - (string): a Svg <path> element
  const svgPath = (points, command) => { // build the d attributes by looping over the points
    
    const d = points.reduce((acc, point, i, a) => i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${command(point, i, a)}` , '')
    return `<path d="${d}" fill="none" stroke="grey" />`
  }
  
  // Svg path line command
  // I:  - point (array) [x, y]: coordinates
  // O:  - (string) 'L x,y': svg line command
  const lineCommand = point => `L ${point[0]} ${point[1]}`
  
  const svg = document.querySelector('.svg')
  svg.innerHTML = svgPath(points, lineCommand)