package com.konstantion.sandbox

import com.konstantion.service.CodeExecutor.Listener
import java.util.concurrent.ConcurrentHashMap

class ListenersHelper<Id> where Id : Any {
  private val listeners: MutableMap<Id, MutableSet<Listener<Id>>> = ConcurrentHashMap()

  operator fun plusAssign(idToListener: Pair<Id, Listener<Id>>) {
    val (id, listener) = idToListener
    listenersOfId(id) += listener
  }

  operator fun minusAssign(idToListener: Pair<Id, Listener<Id>>) {
    val (id, listener) = idToListener
    listenersOfId(id) -= listener
  }

  fun listeners(id: Id): Set<Listener<Id>> = listenersOfId(id)

  private fun listenersOfId(id: Id): MutableSet<Listener<Id>> =
    listeners.computeIfAbsent(id) { ConcurrentHashMap.newKeySet() }
}
