// Delayed visible spacing, then repeated dedicated grabs. No hidden reach data.
export default c=>c.d>c.self.reach+.5?{x:1}:{capture:c.frame%2===0};
