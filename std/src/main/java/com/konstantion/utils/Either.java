package com.konstantion.utils;

import java.util.function.Function;

public sealed interface Either<L, R> {
  <T, E extends Exception> T match(
      CheckedFunction1<L, T, E> onLeft, CheckedFunction1<R, T, E> onRight) throws E;

  <U> Either<L, U> flatMap(Function<? super R, ? extends Either<L, ? extends U>> f);

  <U> Either<L, U> map(Function<? super R, ? extends U> mapper);

  record Left<L, R>(L value) implements Either<L, R> {
    @Override
    public <T, E extends Exception> T match(
        CheckedFunction1<L, T, E> onLeft, CheckedFunction1<R, T, E> onRight) throws E {
      return onLeft.apply(value);
    }

    @Override
    @SuppressWarnings("unchecked")
    public <U> Either<L, U> flatMap(Function<? super R, ? extends Either<L, ? extends U>> f) {
      return (Either<L, U>) this;
    }

    @Override
    @SuppressWarnings("unchecked")
    public <U> Either<L, U> map(Function<? super R, ? extends U> mapper) {
      return (Either<L, U>) this;
    }
  }

  record Right<L, R>(R value) implements Either<L, R> {
    @Override
    public <T, E extends Exception> T match(
        CheckedFunction1<L, T, E> onLeft, CheckedFunction1<R, T, E> onRight) throws E {
      return onRight.apply(value);
    }

    @Override
    @SuppressWarnings("unchecked")
    public <U> Either<L, U> flatMap(Function<? super R, ? extends Either<L, ? extends U>> f) {
      return (Either<L, U>) f.apply(value);
    }

    @Override
    public <U> Either<L, U> map(Function<? super R, ? extends U> mapper) {
      return Either.right(mapper.apply(value));
    }
  }

  static <L, R> Left<L, R> left(L value) {
    return new Left<>(value);
  }

  static <L, R> Right<L, R> right(R value) {
    return new Right<>(value);
  }
}
