package com.konstantion.utils;

import java.util.Objects;

public final class Preconditions {
  private Preconditions() {}

  public static void checkArgument(boolean condition) {
    if (!condition) {
      throw new IllegalArgumentException();
    }
  }

  public static void checkArgument(boolean condition, String message) {
    Objects.requireNonNull(message);
    if (!condition) {
      throw new IllegalArgumentException(message);
    }
  }

  public static void checkState(boolean condition) {
    if (!condition) {
      throw new IllegalStateException();
    }
  }

  public static void checkState(boolean condition, String message) {
    Objects.requireNonNull(message);
    if (!condition) {
      throw new IllegalStateException(message);
    }
  }
}
