export function makeSpring() {
  return { pos: 0, vel: 0 };
}

export function stepSpring(spring, target, dt, stiffness = 200, damping = 18) {
  const force = (target - spring.pos) * stiffness - spring.vel * damping;
  spring.vel += force * dt;
  spring.pos += spring.vel * dt;
}
