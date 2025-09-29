class Linear {
  static easeIn(t, d) { return (t <= 0) ? 0 : (t >= d) ? 1 : t/d; }
  static easeOut(t, d) { return (t <= 0) ? 0 : (t >= d) ? 1 : t/d; }
  static easeInOut(t, d) { return (t <= 0) ? 0 : (t >= d) ? 1 : t/d; }
}

class Quad {
  static easeIn(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = t/d;
    return t*t;
  }
  
  static easeOut(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = t/d;
    return (2*t) - (t*t);
  }
  
  static easeInOut(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    if (t < d/2) return 0.5 * Quad.easeIn(t*2, d);
    else return 0.5 * (1 + Quad.easeOut(t*2-d, d));
  }
}

class Cubic {
  static easeIn(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = (t/d);
    return t*t*t;
  }
  
  static easeOut(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = (t/d) - 1;
    return 1 + t*t*t;
  }
  
  static easeInOut(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    if (t < d/2) return 0.5 * Cubic.easeIn(t*2, d);
    else return 0.5 * (1 + Cubic.easeOut(t*2-d, d));
  }
}

class Quart {
  static easeIn(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = t/d;
    return t*t*t*t;
  }
  
  static easeOut(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = t/d - 1;
    return 1 - t*t*t*t;
  }
  
  static easeInOut(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    if (t < d/2) return 0.5 * Quart.easeIn(t*2, d);
    else return 0.5 * (1 + Quart.easeOut(t*2-d, d));
  }
}

class Quint {
  static easeIn(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = t/d;
    return t*t*t*t*t;
  }
  
  static easeOut(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = t/d - 1;
    return 1 + t*t*t*t*t;
  }
  
  static easeInOut(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    if (t < d/2) return 0.5 * Quint.easeIn(t*2, d);
    else return 0.5 * (1 + Quint.easeOut(t*2-d, d));
  }
}

class Sine {
  static easeIn(t, d) {
    return (t <= 0) ? 0 : (t >= d) ? 1 : 1 - cos(t/d * (PI/2));
  }
  
  static easeOut(t, d) {
    return (t <= 0) ? 0 : (t >= d) ? 1 : sin(t/d * (PI/2));  
  }
  
  static easeInOut(t, d) {
    return (t <= 0) ? 0 : (t >= d) ? 1 : 0.5 * (1 - cos(t/d * PI));
  }
}

class Circ {
  static easeIn(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = t/d;
    return 1 - sqrt(1 - t*t);
  }
  
  static easeOut(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = t/d - 1;
    return sqrt(1 - t*t);
  }
  
  static easeInOut(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    if (t < d/2) return 0.5 * Circ.easeIn(t*2, d);
    else return 0.5 * (1 + Circ.easeOut(t*2-d, d));
  }
}

class Expo {
  static easeIn(t, d) {
    return (t <= 0) ? 0 : (t >= d) ? 1 : pow(2, 10 * (t/d - 1));
  }
  
  static easeOut(t, d) {
    return (t <= 0) ? 0 : (t >= d) ? 1 : 1 - pow(2, -10 * t/d);  
  }
  
  static easeInOut(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    if (t < d/2) return 0.5 * Expo.easeIn(t*2, d);
    else return 0.5 * (1 + Expo.easeOut(t*2-d, d));
  }
}

class Back {
  static easeIn(t, d, s=1.70158) {
    let i = t/d;
    return (t <= 0) ? 0 : (t >= d) ? 1 : i*i*((s+1)*i - s);
  }
  
  static easeOut(t, d, s=1.70158) {
    let i = t/d - 1;
    return (t <= 0) ? 0 : (t >= d) ? 1 : 1 + i*i*((s+1)*i + s);
  }
  
  static easeInOut(t, d, s=1.70158) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    if (t < d/2) return 0.5 * Back.easeIn(t*2, d, s);
    else return 0.5 * (1 + Back.easeOut(t*2-d, d, s));
  }
}

class Bounce {
  static easeIn(t, d) {
    return 1 - Bounce.easeOut(d-t, d);
  }
  
  static easeOut(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = t/d;
    if (t < (1 / 2.75)) {
      return (t * t * 7.5625);
    } else if (t < (2 / 2.75)) {
      t -= (1.5 / 2.75);
      return (t * t * 7.5625 + 0.75);
    } else if (t < (2.5 / 2.75)) {
      t -= (2.25 / 2.75);
      return (t * t * 7.5625 + 0.9375);
    } else {
      t -= (2.625 / 2.75);
      return (t * t * 7.5625 + 0.984375);
    }
  }
  
  static easeInOut(t, d) {
    if (t <= 0) return 0;
    if (t >= d) return 1;
    if (t < d/2) return 0.5 * Bounce.easeIn(t*2, d);
    else return 0.5 * (1 + Bounce.easeOut(t*2-d, d));
  }
}

class Elastic {
  static easeIn(t, d, a=1, m=0.3) {
    let p = d * m;
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = t/d;
    let s = (a < 1) ? p/4 : p/(2*PI) * asin(1/a);
    a = max(a, 1);
    t -= 1;
    return -(a*pow(2, 10*t) * sin((t*d-s) * (2*PI)/p));
  }

  static easeOut(t, d, a=1, m=0.3) {
    let p = d * m;
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = t/d;
    let s = (a < 1) ? p/4 : p/(2*PI) * asin(1/a);
    a = max(a, 1);
    return (a*pow(2,-10*t) * sin((t*d-s)*(2*PI)/p) + 1);  
  }
  
  static easeInOut(t, d, a=1, m=0.3) {
    let p = d * m;
    if (t <= 0) return 0;
    if (t >= d) return 1;
    t = t/(d/2);
    let s = (a < 1) ? p/4 : p/(2*PI) * asin(1/a);
    a = max(a, 1);
    t -= 1;
    if (t < 0) return -0.5 * (a*pow(2,10*t) * sin((t*d-s)*(2*PI)/p));
    return a*pow(2,-10*t) * sin((t*d-s)*(2*PI)/p) * 0.5 + 1;
  }
}