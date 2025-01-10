package com.konstantion.sandbox

import com.konstantion.service.CodeExecutor.Listener
import java.util.concurrent.ConcurrentHashMap

class ListenersHelper<Id> where Id : Any {
  private val idToListeners: MutableMap<Id, MutableSet<Listener<Id>>> = ConcurrentHashMap()
  private val globalListeners: MutableSet<Listener<Id>> = ConcurrentHashMap.newKeySet()

  operator fun plusAssign(idToListener: Pair<Id, Listener<Id>>) {
    val (id, listener) = idToListener
    listenersOfId(id) += listener
  }

  operator fun minusAssign(idToListener: Pair<Id, Listener<Id>>) {
    val (id, listener) = idToListener
    listenersOfId(id) -= listener
  }

  fun listeners(id: Id): Set<Listener<Id>> = listenersOfId(id) + globalListeners

  private fun listenersOfId(id: Id): MutableSet<Listener<Id>> =
    idToListeners.computeIfAbsent(id) { ConcurrentHashMap.newKeySet() }

  private fun addGlobal(listener: Listener<Id>) {
    globalListeners += listener
  }

  companion object {
    fun <Id> withGlobal(listener: Listener<Id>): ListenersHelper<Id> where Id : Any {
      val helper = ListenersHelper<Id>()
      helper.addGlobal(listener)
      return helper
    }
  }
}
