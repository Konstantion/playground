package com.konstantion;

public interface CheckedFunction1<I, O, E extends Exception> {
  O apply(I input) throws E;

  static <I, O, E extends Exception> CheckedFunction1<I, O, E> ref(CheckedFunction1<I, O, E> ref) {
    return ref;
  }

  static <I, E extends Exception> CheckedFunction1<I, I, E> identity() {
    return x -> x;
  }
}
