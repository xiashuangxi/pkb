---
layout: post
title: Test Article
category: [编程语言]
tag: [编程语言]
permalink: /Title::title
toc: true
---
The downside of using this technique is that Wrapper is a new type, so it doesn’t have the methods of the value it’s holding. We would have to implement all the methods of Vec<T> directly on Wrapper such that the methods

# Pointers
 delegate to self.0, which would allow us to treat Wrapper exactly like a Vec<T>. If we wanted the new type to have every method the inner type has, implementing the Deref trait (discussed in Chapter 15 in the “Treating Smar

## delegate
 t Pointers Like Regular References with the Deref Trait” section) on 
 
 the Wrapper to return the inner type would be a solution. If we don’t want the Wrapper type to have all the methods of the inner type—for example,

### restrict
  to restrict the Wrapper type’s behavior—we would have to implement just the methods we do want manually.

Now you know how the newtype pattern is used in relation to traits; 

it’s also a useful pattern even when traits are not involved.

Let’s switch focus and look at some advanced ways to interact with Rust’s type system.
{% include anchor-lib.html name='system' index=1 %}

# Advanced Traits
We first covered traits in the “Traits: Defining Shared Behavior” 

section of Chapter 10, but as with lifetimes, we didn’t discuss 

the more advanced details. Now that you know more about Rust, we can get into the nitty-gritty.{% include anchor-lib.html name='gritty' index=2 desc='section of Chapter 10, but as with lifetimes, we didn’t discuss ' %}

> Associated types connect a type placeholder with a trait such

 that the trait method definitions can use these placeholder
 
  types in their signatures. The implementor of a trait will specify the concrete type to be used in this type’s place for the *particular* implementation. That way, we can define a trait that uses some 
  
  types without needing to know exactly what those **types are until the trait is implemented.**

<sub><a name="system">1.</a>
One example of a trait with an associated type is the Iterator trait that the standard library provides. The associated type is named Item and stands in for the type of the values the type</sub>

<sub><a name="gritty">2.</a>
One example of a trait with an associated type is the Iterator trait that the standard library provides. The associated type is named Item and stands in for the type of the values the type</sub>