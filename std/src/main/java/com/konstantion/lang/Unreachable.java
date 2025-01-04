package com.konstantion.lang;

public final class Unreachable extends IllegalStateException {
  private static final String PREFIX = "Internal error: ";

  public Unreachable(String message) {
    super(withPrefix(message));
  }

  public Unreachable(String message, Throwable cause) {
    super(withPrefix(message), cause);
  }

  private static String withPrefix(String message) {
    return PREFIX.concat(message);
  }
}
