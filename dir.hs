{-
Write a function that when given two lists that each contain two coordinate points, the function will return an array of True or False values depending if the lines created with the points are perpendicular or parallel.

For example:

(((0,2),(1,1)),((0,3),(1,2))) -> (True,False)

(((1,1),(0,0)),((0,1),(1,0))) -> (False,True)

(((0,0),(0,0)),((0,0),(0,0))) -> (False,False)

(((1,4),(2,8)),((0,7),(5,3))) -> (False,False)

Notes:
- No external modules may be used for this challenge.
-}

import Debug.Trace

l1 = [[[0,2],[1,1]],[[0,3],[1,2]]]
l2 = [[[1,1],[0,0]],[[0,1],[1,0]]]
l3 = [[[0,0],[0,0]],[[0,0],[0,0]]]
l4 = [[[1,4],[2,8]],[[0,7],[5,3]]]

--f004 l = map (\x -> (True>>>show x) && ((==0)$sum$z (*) x)) [[a,[-w,v]],r]
--(or$map (all (==0)) r)
f4 l = map((not(elem[0,0]r)&&).(==0).sum.z(*))[[a,[-w,v]],r]
 where
 z f [a,b]=zipWith f a b
 r@[a,[v,w]]=map(z(-))l















(>>>) :: a -> String -> a
(>>>) a str = (trace str a)
debugged :: Show a => a -> a
debugged a = (trace (">>>"++show(a)) a)
